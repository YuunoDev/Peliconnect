const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Configuración del transportador de email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'adrianalonso.a4@gmail.com',
    pass: 'bbpm wyrm lkcr jrxf' // Aquí va tu contraseña de aplicación de Gmail
  }
});

// Generar token único para recuperación
function generateRecoveryToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Generar código de 6 dígitos
function generateRecoveryCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hashear contraseña
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Enviar email con código de recuperación
async function sendRecoveryEmail(email, code, userName) {
  const mailOptions = {
    from: 'adrianalonso.a4@gmail.com',
    to: email,
    subject: 'Recuperación de Contraseña',
    html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0a0a0a;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(220, 38, 38, 0.2);">
          
          <!-- Header con logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d0a0a 100%); padding: 40px 40px 30px; text-align: center; border-bottom: 3px solid #dc2626;">
              <h1 style="margin: 0; color: #dc2626; font-size: 36px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
                PELICONNECT
              </h1>
            </td>
          </tr>

          <!-- Contenido principal -->
          <tr>
            <td style="padding: 40px 40px 30px; background-color: #1a1a1a;">
              <h2 style="color: #ffffff; margin: 0 0 20px; font-size: 24px; font-weight: 600;">
                🔐 Recuperación de Contraseña
              </h2>
              
              <p style="color: #d1d5db; font-size: 16px; line-height: 1.6; margin: 0 0 15px;">
                Hola <strong style="color: #ffffff;">${userName || 'Usuario'}</strong>,
              </p>
              
              <p style="color: #d1d5db; font-size: 16px; line-height: 1.6; margin: 0 0 25px;">
                Recibimos una solicitud para restablecer tu contraseña. Utiliza el siguiente código de verificación:
              </p>

              <!-- Código de recuperación -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 30px 20px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); border-radius: 8px; text-align: center; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);">
                    <div style="font-size: 42px; font-weight: 800; letter-spacing: 8px; color: #ffffff; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);">
                      ${code}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Info de expiración -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 25px 20px; background-color: #2d0a0a; border-left: 4px solid #dc2626; border-radius: 6px; margin-top: 25px;">
                    <p style="margin: 0; color: #fca5a5; font-size: 14px; line-height: 1.5;">
                      ⏰ <strong>Importante:</strong> Este código expirará en <strong>15 minutos</strong> por seguridad.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin: 25px 0 0;">
                Si no solicitaste el restablecimiento de tu contraseña, puedes ignorar este mensaje de forma segura. Tu contraseña permanecerá sin cambios.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #0a0a0a; border-top: 1px solid #2d2d2d;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px; line-height: 1.5; text-align: center;">
                Este es un mensaje automático, por favor no respondas a este correo.
              </p>
              <p style="margin: 0; color: #4b5563; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} PeliConnect. Todos los derechos reservados.
              </p>
              <div style="text-align: center; margin-top: 15px;">
                <a href="#" style="color: #dc2626; text-decoration: none; font-size: 12px; margin: 0 10px;">Política de Privacidad</a>
                <span style="color: #4b5563;">|</span>
                <a href="#" style="color: #dc2626; text-decoration: none; font-size: 12px; margin: 0 10px;">Términos de Uso</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email enviado exitosamente' };
  } catch (error) {
    console.error('Error al enviar email:', error);
    return { success: false, message: 'Error al enviar el email' };
  }
}

async function sendVerificationEmail(email, code, userName) {
  const mailOptions = {
    from: 'adrianalonso.a4@gmail.com',
    to: email,
    subject: 'Validar email',
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0a0a0a;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(220, 38, 38, 0.2);">
          
          <!-- Header con logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d0a0a 100%); padding: 40px 40px 30px; text-align: center; border-bottom: 3px solid #dc2626;">
              <h1 style="margin: 0; color: #dc2626; font-size: 36px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
                PELICONNECT
              </h1>
            </td>
          </tr>

          <!-- Contenido principal -->
          <tr>
            <td style="padding: 40px 40px 30px; background-color: #1a1a1a;">
              <h2 style="color: #ffffff; margin: 0 0 20px; font-size: 24px; font-weight: 600;">
                🎉 ¡Bienvenido a PeliConnect!
              </h2>
              
              <p style="color: #d1d5db; font-size: 16px; line-height: 1.6; margin: 0 0 15px;">
                Hola <strong style="color: #ffffff;">${userName}</strong>,
              </p>
              
              <p style="color: #d1d5db; font-size: 16px; line-height: 1.6; margin: 0 0 25px;">
                Gracias por registrarte en nuestra plataforma. Para completar tu registro, utiliza el siguiente código de verificación:
              </p>

              <!-- Código de verificación -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 30px 20px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); border-radius: 8px; text-align: center; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);">
                    <div style="font-size: 42px; font-weight: 800; letter-spacing: 8px; color: #ffffff; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);">
                      ${code}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Info de expiración -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 25px 20px; background-color: #2d0a0a; border-left: 4px solid #dc2626; border-radius: 6px; margin-top: 25px;">
                    <p style="margin: 0; color: #fca5a5; font-size: 14px; line-height: 1.5;">
                      ⏰ <strong>Importante:</strong> Este código expirará en <strong>10 minutos</strong> por seguridad.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin: 25px 0 0;">
                Si no solicitaste este código, ignora este mensaje de forma segura.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #0a0a0a; border-top: 1px solid #2d2d2d;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px; line-height: 1.5; text-align: center;">
                Este es un mensaje automático, por favor no respondas a este correo.
              </p>
              <p style="margin: 0; color: #4b5563; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} PeliConnect. Todos los derechos reservados.
              </p>
              <div style="text-align: center; margin-top: 15px;">
                <a href="#" style="color: #dc2626; text-decoration: none; font-size: 12px; margin: 0 10px;">Política de Privacidad</a>
                <span style="color: #4b5563;">|</span>
                <a href="#" style="color: #dc2626; text-decoration: none; font-size: 12px; margin: 0 10px;">Términos de Uso</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email enviado exitosamente' };
  } catch (error) {
    console.error('Error al enviar email:', error);
    return { success: false, message: 'Error al enviar el email' };
  }

}

module.exports = {
  generateRecoveryToken,
  generateRecoveryCode,
  sendRecoveryEmail,
  hashPassword,
  sendVerificationEmail
};