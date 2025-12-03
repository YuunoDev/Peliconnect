const request = require('supertest');
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const authRoutes = require('../reco.js'); // ajusta la ruta real


// Mock de las dependencias
jest.mock('mysql2/promise');
jest.mock('bcrypt');
jest.mock('../EmailService.js', () => ({
  generateRecoveryCode: jest.fn(() => '123456'),
  sendRecoveryEmail: jest.fn(() => Promise.resolve({ success: true })),
  hashPassword: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
  sendVerificationEmail: jest.fn(() => Promise.resolve({ success: true })),
  sendBanEmail: jest.fn(),
  sendloginEmail: jest.fn()
}));


const app = express();
app.use(express.json());
app.use('/', authRoutes);


describe('Password Reset Flow', () => {
  let mockConnection;

  beforeEach(() => {
    mockConnection = {
      execute: jest.fn(),
      end: jest.fn()
    };
    mysql.createConnection.mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /request-password-reset', () => {
    test('debe retornar error si no se proporciona email', async () => {
      const response = await request(app)
        .post('/request-password-reset')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email requerido');
    });

    test('debe enviar código de recuperación para usuario existente', async () => {
      mockConnection.execute
        .mockResolvedValueOnce([[{ id: 1, nombre: 'Juan' }]])
        .mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response = await request(app)
        .post('/request-password-reset')
        .send({ Correo: 'juan@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Código de recuperación enviado a tu Correo');
      expect(mockConnection.execute).toHaveBeenCalledTimes(2);
    });

    test('debe retornar mensaje genérico si usuario no existe', async () => {
      mockConnection.execute.mockResolvedValueOnce([[]]);

      const response = await request(app)
        .post('/request-password-reset')
        .send({ Correo: 'noexiste@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'Si el Correo existe, recibirás un código de recuperación'
      );
    });

    test('debe manejar error al enviar email', async () => {
      const { sendRecoveryEmail } = require('../EmailService.js');
      sendRecoveryEmail.mockResolvedValueOnce({ success: false });

      mockConnection.execute
        .mockResolvedValueOnce([[{ id: 1, nombre: 'Juan' }]])
        .mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response = await request(app)
        .post('/request-password-reset')
        .send({ Correo: 'juan@example.com' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error al enviar el Correo');
    });
  });

  describe('POST /verify-recovery-code', () => {
    test('debe retornar error si faltan parámetros', async () => {
      const response = await request(app)
        .post('/verify-recovery-code')
        .send({ Correo: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email y código requeridos');
    });

    test('debe verificar código correctamente', async () => {
      const futureDate = new Date(Date.now() + 15 * 60 * 1000);
      mockConnection.execute
        .mockResolvedValueOnce([[{
          recovery_code: '123456',
          recovery_code_expires_at: futureDate,
          recovery_attempts: 0
        }]])
        .mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response = await request(app)
        .post('/verify-recovery-code')
        .send({ Correo: 'juan@example.com', code: '123456' });

      expect(response.status).toBe(200);
      expect(response.body.verified).toBe(true);
      expect(response.body.resetToken).toBeDefined();
    });

    test('debe rechazar código incorrecto', async () => {
      const futureDate = new Date(Date.now() + 15 * 60 * 1000);
      mockConnection.execute
        .mockResolvedValueOnce([[{
          recovery_code: '123456',
          recovery_code_expires_at: futureDate,
          recovery_attempts: 0
        }]])
        .mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response = await request(app)
        .post('/verify-recovery-code')
        .send({ Correo: 'juan@example.com', code: '999999' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Código incorrecto');
      expect(response.body.attemptsLeft).toBe(4);
    });

    test('debe rechazar código expirado', async () => {
      const pastDate = new Date(Date.now() - 1000);
      mockConnection.execute.mockResolvedValueOnce([[{
        recovery_code: '123456',
        recovery_code_expires_at: pastDate,
        recovery_attempts: 0
      }]]);

      const response = await request(app)
        .post('/verify-recovery-code')
        .send({ Correo: 'juan@example.com', code: '123456' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Código expirado. Solicita uno nuevo');
    });

    test('debe bloquear después de 5 intentos', async () => {
      mockConnection.execute.mockResolvedValueOnce([[{
        recovery_code: '123456',
        recovery_code_expires_at: new Date(Date.now() + 15 * 60 * 1000),
        recovery_attempts: 5
      }]]);

      const response = await request(app)
        .post('/verify-recovery-code')
        .send({ Correo: 'juan@example.com', code: '123456' });

      expect(response.status).toBe(429);
      expect(response.body.error).toBe('Demasiados intentos. Solicita un nuevo código');
    });
  });

  describe('POST /reset-password', () => {
    test('debe retornar error si faltan parámetros', async () => {
      const response = await request(app)
        .post('/reset-password')
        .send({ Correo: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email, token y nueva contraseña requeridos');
    });

    test('debe validar longitud mínima de contraseña', async () => {
      const response = await request(app)
        .post('/reset-password')
        .send({
          Correo: 'test@example.com',
          resetToken: 'token123',
          newPassword: 'short'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('La contraseña debe tener al menos 8 caracteres');
    });

    test('debe restablecer contraseña correctamente', async () => {
      const futureDate = new Date(Date.now() + 10 * 60 * 1000);
      mockConnection.execute
        .mockResolvedValueOnce([[{
          reset_token: 'validtoken',
          reset_token_expires_at: futureDate
        }]])
        .mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response = await request(app)
        .post('/reset-password')
        .send({
          Correo: 'juan@example.com',
          resetToken: 'validtoken',
          newPassword: 'newpassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Contraseña restablecida exitosamente');
    });

    test('debe rechazar token inválido', async () => {
      mockConnection.execute.mockResolvedValueOnce([[{
        reset_token: 'validtoken',
        reset_token_expires_at: new Date(Date.now() + 10 * 60 * 1000)
      }]]);

      const response = await request(app)
        .post('/reset-password')
        .send({
          Correo: 'juan@example.com',
          resetToken: 'invalidtoken',
          newPassword: 'newpassword123'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Token inválido');
    });
  });
});

describe('User Registration', () => {
  let mockConnection;

  beforeEach(() => {
    mockConnection = {
      execute: jest.fn(),
      end: jest.fn()
    };
    mysql.createConnection.mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /registrarUsuario', () => {
    test('debe registrar usuario nuevo exitosamente', async () => {
      bcrypt.hash.mockResolvedValue('hashed_password');
      mockConnection.execute
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response = await request(app)
        .post('/registrarUsuario')
        .send({
          user: 'nuevoUsuario',
          pass: 'password123',
          email: 'nuevo@example.com'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.requiresVerification).toBe(true);
    });

    test('debe rechazar usuario duplicado', async () => {
      mockConnection.execute.mockResolvedValueOnce([[{ id: 1 }]]);

      const response = await request(app)
        .post('/registrarUsuario')
        .send({
          user: 'usuarioExistente',
          pass: 'password123',
          email: 'test@example.com'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('El nombre de usuario ya está registrado');
    });
  });
});

describe('Email Verification', () => {
  let mockConnection;

  beforeEach(() => {
    mockConnection = {
      execute: jest.fn(),
      end: jest.fn()
    };
    mysql.createConnection.mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /send-verification', () => {
    test('debe enviar código de verificación', async () => {
      mockConnection.execute
        .mockResolvedValueOnce([[{ id: 1, nombre: 'Juan' }]])
        .mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response = await request(app)
        .post('/send-verification')
        .send({ email: 'juan@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Código enviado a tu email');
    });

    test('debe retornar error si no se proporciona email', async () => {
      const response = await request(app)
        .post('/send-verification')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email requerido');
    });
  });

  describe('POST /verify-code', () => {
    test('debe verificar código correctamente', async () => {
      const futureDate = new Date(Date.now() + 10 * 60 * 1000);
      mockConnection.execute
        .mockResolvedValueOnce([[{
          verification_code: '123456',
          code_expires_at: futureDate
        }]])
        .mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response = await request(app)
        .post('/verify-code')
        .send({ email: 'juan@example.com', code: '123456' });

      expect(response.status).toBe(200);
      expect(response.body.verified).toBe(true);
    });

    test('debe rechazar código incorrecto', async () => {
      const futureDate = new Date(Date.now() + 10 * 60 * 1000);
      mockConnection.execute.mockResolvedValueOnce([[{
        verification_code: '123456',
        code_expires_at: futureDate
      }]]);

      const response = await request(app)
        .post('/verify-code')
        .send({ email: 'juan@example.com', code: '999999' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Código incorrecto');
    });

    test('debe rechazar código expirado', async () => {
      const pastDate = new Date(Date.now() - 1000);
      mockConnection.execute.mockResolvedValueOnce([[{
        verification_code: '123456',
        code_expires_at: pastDate
      }]]);

      const response = await request(app)
        .post('/verify-code')
        .send({ email: 'juan@example.com', code: '123456' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Código expirado');
    });

    test('debe retornar error si faltan parámetros', async () => {
      const response = await request(app)
        .post('/verify-code')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email y código requeridos');
    });
  });
});