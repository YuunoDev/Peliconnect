const express = require('express');
const router = express.Router();
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { connection: con } = require('./db');

// Generar secreto y QR
router.post('/generate', async (req, res) => {
  try {
    const { userId } = req.body;

    // 1. Buscar usuario
    const [rows] = await con.promise().query(
      'SELECT id, Nombre, Correo FROM usuario WHERE id = ?',
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = rows[0];

    // 2. Generar secreto
    const secret = speakeasy.generateSecret({
      name: `PELICONNECT (${user.Nombre})`
    });

    // 3. Generar QR
    const qrCode = await qrcode.toDataURL(secret.otpauth_url);

    // 4. Guardar secreto temporalmente
    await con.promise().query(
      'UPDATE usuario SET twofa_secret = ? WHERE id = ?',
      [secret.base32, userId]
    );

    // 5. Enviar QR al frontend
    res.json({
      success: true,
      qrCode
    });

  } catch (err) {
    console.error('Error generate 2FA:', err);
    res.status(500).json({ error: 'Error al generar 2FA' });
  }
});



router.post('/verify', async (req, res) => {
  try {
    const { userId, token } = req.body;

    // 1. Buscar secreto del usuario
    const [rows] = await con.promise().query(
      'SELECT twofa_secret FROM usuario WHERE id = ?',
      [userId]
    );

    if (!rows.length || !rows[0].twofa_secret) {
      return res.status(400).json({ error: 'No hay secreto 2FA generado' });
    }

    const secret = rows[0].twofa_secret;

    // 2. Verificar código
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2
    });

    if (!verified) {
      return res.json({ success: false, message: 'Código incorrecto' });
    }

    // 3. Activar 2FA
    await con.promise().query(
      'UPDATE usuario SET two_fa = 1 WHERE id = ?',
      [userId]
    );

    res.json({ success: true });

  } catch (err) {
    console.error('Error verify 2FA:', err);
    res.status(500).json({ error: 'Error al verificar 2FA' });
  }
});

router.post('/disable', async (req, res) => {
  try {
    const { userId, token } = req.body;

    const [rows] = await con.promise().query(
      'SELECT twofa_secret FROM usuario WHERE id = ?',
      [userId]
    );

    if (!rows.length || !rows[0].twofa_secret) {
      return res.status(400).json({ error: '2FA no activo' });
    }

    const verified = speakeasy.totp.verify({
      secret: rows[0].twofa_secret,
      encoding: 'base32',
      token,
      window: 2
    });

    if (!verified) {
      return res.json({ success: false, error: 'Código incorrecto' });
    }

    await con.promise().query(
      'UPDATE usuario SET two_fa = 0, twofa_secret = NULL WHERE id = ?',
      [userId]
    );

    res.json({ success: true });

  } catch (err) {
    console.error('Error disabling 2FA:', err);
    res.status(500).json({ error: 'Error al desactivar 2FA' });
  }
});

module.exports = router;