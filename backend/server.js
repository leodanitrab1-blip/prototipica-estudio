import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// 1. CORS
// ============================================
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

// ============================================
// 2. MIDDLEWARE JSON
// ============================================
app.use(express.json({ limit: '10mb' }));

// ============================================
// 3. BASE DE DATOS LOCAL
// ============================================
const DB_PATH = path.join(__dirname, '../data/productos.json');
const DATA_DIR = path.join(__dirname, '../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const leerProductos = () => {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error al leer productos:', error.message);
  }
  return [];
};

const guardarProductos = (productos) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(productos, null, 2));
    return true;
  } catch (error) {
    console.error('Error al guardar productos:', error.message);
    return false;
  }
};

let productosDB = leerProductos();
if (productosDB.length === 0) {
  productosDB = [
    {
      id: 1,
      nombre: 'Sistema POS Pro',
      precio: 2999,
      descripcion: 'Sistema de punto de venta',
      imagen: 'https://placehold.co/600x400/1a1a1a/ffffff?text=POS+Pro',
      video: '',
      enlaceDescarga: 'https://ejemplo.com/descargas/pos-pro.zip',
      fecha: new Date().toISOString()
    }
  ];
  guardarProductos(productosDB);
}

// ============================================
// 4. FUNCIÓN PARA ENVIAR CORREO CON RESEND
// ============================================
const enviarCorreoResend = async (destinatario, asunto, html, replyTo = null) => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  
  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY no configurada');
  }

  const emailData = {
    from: 'Prototipica Estudio <onboarding@resend.dev>',
    to: destinatario,
    subject: asunto,
    html: html
  };

  if (replyTo) {
    emailData.reply_to = replyTo;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error Resend: ${JSON.stringify(errorData)}`);
  }

  return await response.json();
};

// ============================================
// 5. RUTAS API
// ============================================

// Test
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend funcionando',
    resend: process.env.RESEND_API_KEY ? '✅' : '❌'
  });
});

// Productos
app.get('/api/productos', (req, res) => {
  res.json(productosDB);
});

app.post('/api/productos', (req, res) => {
  try {
    const { nombre, precio, descripcion, imagen, video, enlaceDescarga } = req.body;
    if (!nombre || !precio) return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    const nuevo = {
      id: Date.now(),
      nombre: nombre.trim(),
      precio: Number(precio),
      descripcion: descripcion || '',
      imagen: imagen || '',
      video: video || '',
      enlaceDescarga: enlaceDescarga || '',
      fecha: new Date().toISOString()
    };
    productosDB.push(nuevo);
    guardarProductos(productosDB);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});

app.delete('/api/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  productosDB = productosDB.filter(p => p.id !== id);
  guardarProductos(productosDB);
  res.json({ success: true });
});

app.put('/api/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = productosDB.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });
  const { nombre, precio, descripcion, imagen, video, enlaceDescarga } = req.body;
  productosDB[index] = {
    ...productosDB[index],
    nombre: nombre || productosDB[index].nombre,
    precio: precio !== undefined ? Number(precio) : productosDB[index].precio,
    descripcion: descripcion !== undefined ? descripcion : productosDB[index].descripcion,
    imagen: imagen !== undefined ? imagen : productosDB[index].imagen,
    video: video !== undefined ? video : productosDB[index].video,
    enlaceDescarga: enlaceDescarga !== undefined ? enlaceDescarga : productosDB[index].enlaceDescarga
  };
  guardarProductos(productosDB);
  res.json(productosDB[index]);
});

// ENVIAR CORREO
app.post('/api/enviar-correo', async (req, res) => {
  console.log('📧 POST /api/enviar-correo');
  console.log('Datos recibidos:', req.body);
  
  try {
    const datos = req.body;
    if (!datos || !datos.email) {
      return res.status(400).json({ error: 'Falta el correo electrónico' });
    }

    const tipo = datos.tipo || 'contacto';
    const asunto = tipo === 'cotizacion' ? '📋 Nueva Cotización' : '📬 Nuevo Mensaje de Contacto';
    
    const html = `
      <h2>${asunto}</h2>
      <p><strong>Nombre:</strong> ${datos.nombre || 'No especificado'}</p>
      <p><strong>Email:</strong> ${datos.email}</p>
      ${datos.telefono ? `<p><strong>Teléfono:</strong> ${datos.telefono}</p>` : ''}
      ${datos.presupuesto ? `<p><strong>Presupuesto:</strong> $${datos.presupuesto} MXN</p>` : ''}
      <p><strong>${tipo === 'cotizacion' ? 'Descripción' : 'Mensaje'}:</strong></p>
      <p>${datos.descripcion || datos.mensaje || 'No especificado'}</p>
    `;

    // Enviar a tu correo
    const resultado = await enviarCorreoResend(
      'pdabasel1@gmail.com',
      `${asunto} - Prototipica Estudio`,
      html,
      datos.email
    );

    console.log('✅ Correo enviado con éxito:', resultado);
    res.json({ success: true, message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
    res.status(500).json({ 
      error: 'Error al enviar correo',
      details: error.message 
    });
  }
});

// STRIPE
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/api/crear-sesion-pago', async (req, res) => {
  try {
    const { nombre, precio, descripcion, email, enlaceDescarga } = req.body;
    if (!nombre || !precio || precio <= 0) {
      return res.status(400).json({ error: 'Datos del producto inválidos' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [{
        price_data: {
          currency: 'mxn',
          product_data: {
            name: nombre,
            description: descripcion || 'Software'
          },
          unit_amount: Math.round(precio * 100)
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: 'https://prototipica-estudio.onrender.com?success=true',
      cancel_url: 'https://prototipica-estudio.onrender.com?canceled=true',
      metadata: {
        producto: nombre,
        enlace_descarga: enlaceDescarga || 'https://prototipica-estudio.onrender.com'
      }
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error en Stripe:', error);
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
});

// WEBHOOK STRIPE
app.post('/api/webhook-stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    let event;
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = JSON.parse(req.body.toString());
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const email = session.customer_details?.email || session.customer_email;
      const producto = session.metadata?.producto || 'Software';
      const enlaceDescarga = session.metadata?.enlace_descarga || 'https://prototipica-estudio.onrender.com';

      if (email) {
        await enviarCorreoResend(
          email,
          `✅ Tu compra de "${producto}" está lista`,
          `<h2>🎉 ¡Gracias por tu compra!</h2>
           <p>Tu pago ha sido procesado correctamente.</p>
           <p><strong>Producto:</strong> ${producto}</p>
           <p><a href="${enlaceDescarga}">📥 Descargar software</a></p>`
        );
      }
    }
    res.json({ received: true });
  } catch (error) {
    console.error('Error webhook:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

// ============================================
// 6. FRONTEND
// ============================================
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ============================================
// 7. INICIAR
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
  console.log(`📧 Resend API: ${process.env.RESEND_API_KEY ? '✅' : '❌'}`);
});
