import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import Stripe from 'stripe';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 1. MIDDLEWARE (Siempre al principio)
app.use(cors());
app.use(express.json());

// 2. RUTAS DE API (ANTES de servir archivos estáticos)

// ==================== CORREO ====================
const crearTransporter = () => {
  if (!process.env.TU_CORREO || !process.env.CONTRASENA_APP) {
    console.error('❌ Variables de correo no configuradas');
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.TU_CORREO, pass: process.env.CONTRASENA_APP },
    tls: { rejectUnauthorized: false }
  });
};

app.post('/api/enviar-correo', async (req, res) => {
  console.log('📧 Recibida solicitud de correo');
  try {
    const datos = req.body;
    if (!datos?.email) return res.status(400).json({ error: 'Falta el correo' });

    const transporter = crearTransporter();
    if (!transporter) return res.status(500).json({ error: 'Error al configurar el correo' });

    await transporter.sendMail({
      from: `"Prototipica Estudio" <${process.env.TU_CORREO}>`,
      to: process.env.TU_CORREO,
      replyTo: datos.email,
      subject: datos.tipo === 'cotizacion' ? '📋 Nueva Cotización' : '📬 Nuevo Mensaje',
      html: `
        <h2>${datos.tipo === 'cotizacion' ? 'Cotización' : 'Mensaje'}</h2>
        <p><strong>Nombre:</strong> ${datos.nombre || 'N/E'}</p>
        <p><strong>Email:</strong> ${datos.email}</p>
        ${datos.telefono ? `<p><strong>Teléfono:</strong> ${datos.telefono}</p>` : ''}
        ${datos.presupuesto ? `<p><strong>Presupuesto:</strong> $${datos.presupuesto} MXN</p>` : ''}
        <p><strong>${datos.tipo === 'cotizacion' ? 'Descripción' : 'Mensaje'}:</strong></p>
        <p>${datos.descripcion || datos.mensaje || 'N/E'}</p>
      `
    });
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error en correo:', error);
    res.status(500).json({ error: 'Error al enviar correo' });
  }
});

// ==================== STRIPE ====================
app.post('/api/crear-sesion-pago', async (req, res) => {
  console.log('🔍 Recibida solicitud de pago');
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Stripe no configurado' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { nombre, precio, descripcion } = req.body;

    if (!nombre || !precio || precio <= 0) {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'mxn',
          product_data: { name: nombre, description: descripcion || 'Software' },
          unit_amount: Math.round(precio * 100)
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${process.env.SITE_URL || 'https://prototipica-estudio.onrender.com'}/?success=true`,
      cancel_url: `${process.env.SITE_URL || 'https://prototipica-estudio.onrender.com'}/?canceled=true`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('❌ Error en Stripe:', error);
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
});

// 3. ARCHIVOS ESTÁTICOS (DESPUÉS de las rutas API)
app.use(express.static(path.join(__dirname, '../dist')));

// 4. CUALQUIER OTRA RUTA (Solo si no coincide con /api o archivos estáticos)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// 5. INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📧 TU_CORREO: ${process.env.TU_CORREO || '❌ No configurado'}`);
  console.log(`💳 STRIPE: ${process.env.STRIPE_SECRET_KEY ? '✅ Configurado' : '❌ No configurado'}`);
});