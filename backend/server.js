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

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend (desde la carpeta dist)
app.use(express.static(path.join(__dirname, '../dist')));

console.log('🚀 Servidor iniciado');
console.log('📧 TU_CORREO:', process.env.TU_CORREO || '❌ No configurado');
console.log('💳 STRIPE:', process.env.STRIPE_SECRET_KEY ? '✅ Configurado' : '❌ No configurado');

// ==================== CORREO ====================
const crearTransporter = () => {
  if (!process.env.TU_CORREO || !process.env.CONTRASENA_APP) {
    console.error('❌ Variables de correo no configuradas');
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.TU_CORREO,
      pass: process.env.CONTRASENA_APP
    },
    tls: { rejectUnauthorized: false }
  });
};

app.post('/api/enviar-correo', async (req, res) => {
  console.log('📧 Recibida solicitud de correo');
  console.log('📝 Datos:', req.body);
  
  try {
    const datos = req.body;
    if (!datos || !datos.email) {
      return res.status(400).json({ error: 'Falta el correo electrónico' });
    }

    const transporter = crearTransporter();
    if (!transporter) {
      return res.status(500).json({ error: 'Error al configurar el correo' });
    }

    const mailOptions = {
      from: `"Prototipica Estudio" <${process.env.TU_CORREO}>`,
      to: process.env.TU_CORREO,
      replyTo: datos.email,
      subject: datos.tipo === 'cotizacion' ? '📋 Nueva Cotización' : '📬 Nuevo Mensaje de Contacto',
      html: `
        <h2>${datos.tipo === 'cotizacion' ? 'Nueva Cotización' : 'Nuevo Mensaje'}</h2>
        <p><strong>Nombre:</strong> ${datos.nombre || 'No especificado'}</p>
        <p><strong>Email:</strong> ${datos.email}</p>
        ${datos.telefono ? `<p><strong>Teléfono:</strong> ${datos.telefono}</p>` : ''}
        ${datos.presupuesto ? `<p><strong>Presupuesto:</strong> $${datos.presupuesto} MXN</p>` : ''}
        <p><strong>${datos.tipo === 'cotizacion' ? 'Descripción' : 'Mensaje'}:</strong></p>
        <p>${datos.descripcion || datos.mensaje || 'No especificado'}</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Correo enviado:', info.messageId);
    res.json({ success: true, message: 'Correo enviado' });
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
    res.status(500).json({ error: 'Error al enviar correo', details: error.message });
  }
});

// ==================== STRIPE ====================
app.post('/api/crear-sesion-pago', async (req, res) => {
  console.log('🔍 Recibida solicitud de pago');
  console.log('📦 Producto:', req.body);
  
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY no está configurada');
      return res.status(500).json({ error: 'Stripe no está configurado' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { productoId, nombre, precio, descripcion } = req.body;

    if (!nombre || !precio || precio <= 0) {
      return res.status(400).json({ error: 'Datos del producto inválidos' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'mxn',
          product_data: { 
            name: nombre, 
            description: descripcion || 'Software de Prototipica Estudio' 
          },
          unit_amount: Math.round(precio * 100)
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${process.env.SITE_URL || 'https://prototipica-estudio.onrender.com'}/?success=true`,
      cancel_url: `${process.env.SITE_URL || 'https://prototipica-estudio.onrender.com'}/?canceled=true`,
      metadata: { productoId: productoId.toString() }
    });

    console.log('✅ Sesión creada:', session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error('❌ Error en Stripe:', error);
    res.status(500).json({ error: 'Error al procesar el pago', details: error.message });
  }
});

// ==================== FRONTEND ====================
// Todas las rutas que no sean /api/* sirven el index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ==================== INICIAR SERVIDOR ====================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 URL: https://prototipica-estudio.onrender.com`);
});