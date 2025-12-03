const express = require('express');
const mysql = require('mysql2/promise');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const {
  generateRecoveryCode,
  sendRecoveryEmail,
  hashPassword,
  sendVerificationEmail,
  sendBanEmail,
  sendloginEmail
} = require('./EmailService.js');
const { config: dbConfig } = require('./db'); // Importa solo la config
const { log } = require('console');

const router = express.Router();

// PASO 1: Solicitar código de recuperación
router.post('/request-password-reset', async (req, res) => {
  const { Correo } = req.body;

  if (!Correo) {
    return res.status(400).json({ error: 'Email requerido' });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      'SELECT id, nombre FROM usuario WHERE Correo = ?',
      [Correo]
    );

    if (rows.length === 0) {
      return res.json({
        message: 'Si el Correo existe, recibirás un código de recuperación'
      });
    }

    const user = rows[0];
    const recoveryCode = generateRecoveryCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await connection.execute(
      `UPDATE usuario 
       SET recovery_code = ?, 
           recovery_code_expires_at = ?,
           recovery_attempts = 0
       WHERE Correo = ?`,
      [recoveryCode, expiresAt, Correo]
    );

    const result = await sendRecoveryEmail(Correo, recoveryCode, user.nombre);

    if (result.success) {
      res.json({
        message: 'Código de recuperación enviado a tu Correo',
        Correo: Correo
      });
    } else {
      res.status(500).json({ error: 'Error al enviar el Correo' });
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (connection) await connection.end();
  }
});

// PASO 2: Verificar código de recuperación
router.post('/verify-recovery-code', async (req, res) => {
  const { Correo, code } = req.body;

  if (!Correo || !code) {
    return res.status(400).json({ error: 'Email y código requeridos' });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      `SELECT recovery_code, recovery_code_expires_at, recovery_attempts 
       FROM usuario 
       WHERE Correo = ?`,
      [Correo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = rows[0];
    const now = new Date();

    if (user.recovery_attempts >= 5) {
      return res.status(429).json({
        error: 'Demasiados intentos. Solicita un nuevo código'
      });
    }

    if (new Date(user.recovery_code_expires_at) < now) {
      return res.status(400).json({ error: 'Código expirado. Solicita uno nuevo' });
    }

    if (user.recovery_code !== code) {
      await connection.execute(
        'UPDATE usuario SET recovery_attempts = recovery_attempts + 1 WHERE Correo = ?',
        [Correo]
      );
      return res.status(400).json({
        error: 'Código incorrecto',
        attemptsLeft: 5 - (user.recovery_attempts + 1)
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await connection.execute(
      `UPDATE usuario 
       SET reset_token = ?,
           reset_token_expires_at = ?
       WHERE Correo = ?`,
      [resetToken, tokenExpiry, Correo]
    );

    res.json({
      message: 'Código verificado correctamente',
      resetToken: resetToken,
      verified: true
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (connection) await connection.end();
  }
});

// PASO 3: Restablecer contraseña
router.post('/reset-password', async (req, res) => {
  const { Correo, resetToken, newPassword } = req.body;

  if (!Correo || !resetToken || !newPassword) {
    return res.status(400).json({
      error: 'Email, token y nueva contraseña requeridos'
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      error: 'La contraseña debe tener al menos 8 caracteres'
    });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      `SELECT reset_token, reset_token_expires_at 
       FROM usuario 
       WHERE Correo = ?`,
      [Correo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = rows[0];
    const now = new Date();

    if (user.reset_token !== resetToken) {
      return res.status(400).json({ error: 'Token inválido' });
    }

    if (new Date(user.reset_token_expires_at) < now) {
      return res.status(400).json({ error: 'Token expirado. Inicia el proceso nuevamente' });
    }

    const hashedPassword = await hashPassword(newPassword);

    await connection.execute(
      `UPDATE usuario 
       SET password = ?,
           recovery_code = NULL,
           recovery_code_expires_at = NULL,
           recovery_attempts = 0,
           reset_token = NULL,
           reset_token_expires_at = NULL,
           updated_at = NOW()
       WHERE Correo = ?`,
      [hashedPassword, Correo]
    );

    res.json({
      message: 'Contraseña restablecida exitosamente',
      success: true
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (connection) await connection.end();
  }
});

// Registrar usuario
router.post(`/registrarUsuario`, async (req, res) => {
  const user = req.body.user;
  const pass = req.body.pass;
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      'SELECT * FROM Usuario WHERE nombre = ?', [user]
    );

    if (rows.length !== 0) {
      return res.json({
        message: 'El nombre de usuario ya está registrado'
      });
    }

    // Usuario y email no existen, registrarlo
    try {
      // encriptar contraseña connection bcrypt
      const hashedPass = await bcrypt.hash(pass, 10);

      await connection.execute(
        'INSERT INTO Usuario (nombre, password, is_verified) VALUES (?, ?,  0)',
        [user, hashedPass]);


      console.log('Usuario registrado exitosamente');
      return res.json({
        success: true,
        message: 'Usuario registrado. Por favor verifica tu email',
        requiresVerification: true
      });


    } catch (error) {
      console.error('Error al registrar usuario:', error);
      res.status(500).json({ error: 'Error interno', message: 'Error al procesar el registro' });
    }


  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (connection) await connection.end();
  }

});

// Ruta para enviar código de verificación
router.post('/send-verification', async (req, res) => {
  const { email,username } = req.body;
  let connection;
  

  if (!email) {
    return res.status(400).json({ error: 'Email requerido' });
  }

  try {
    connection = await mysql.createConnection(dbConfig);

    const [rows2] = await connection.execute(
      'SELECT * FROM Usuario WHERE Correo = ?', [email]
    );

    if (rows2.length !== 0) {
      return res.json({
        message: 'El email ya está registrado'
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // Guardar código en la base de datos
    await connection.execute(
      'UPDATE Usuario SET verification_code = ?, code_expires_at = ? WHERE nombre = ?',
      [code, expiresAt, username]);

    // Enviar email (necesitas configurar nodemailer)
    const emailResult = await sendVerificationEmail(email, code, username);
    console.log("Correo enviado")

    if (emailResult.success) {
      res.json({ message: 'Código enviado a tu email' });
    } else {
      res.status(500).json({ error: 'Error al enviar email' });
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Ruta para verificar código
router.post('/verify-code', async (req, res) => {
  const { email, code, username } = req.body;
  let connection;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email y código requeridos' });
  }
  try {
    connection = await mysql.createConnection(dbConfig);

    const [results] = await connection.execute(
      'SELECT verification_code, code_expires_at FROM Usuario WHERE nombre = ?',
      [username])
    
    if (results === 0){
      return res.status(400).json({ error: 'No encontrado' });
    }

    const user = results[0];
    const now = new Date();

    // Verificar código
    if (user.verification_code !== code) {
      return res.status(400).json({ error: 'Código incorrecto' });
    }

    // Verificar expiración
    if (new Date(user.code_expires_at) < now) {
      return res.status(400).json({ error: 'Código expirado' });
    }

    // Código correcto, marcar como verificado
    const up = await connection.execute(
      'UPDATE Usuario SET is_verified = 1, verification_code = NULL, code_expires_at = NULL, Correo = ? WHERE nombre = ?',
      [email, username]);

    if (up === 0) {
      return res.status(400).json({ error: 'Error de validación' });
    }

    console.log('Usuario verificado exitosamente');
    res.json({
      message: 'Verificación exitosa',
      verified: true
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;