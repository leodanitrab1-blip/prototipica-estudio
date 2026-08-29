import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'apikey']
}));
app.options('*', cors());

// JSON
app.use(express.json({ limit: '10mb' }));

// Supabase config
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mcqpnkjnktzmaxkqwafc.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_ECwaAPhBKcLaNJGiS08h0A_n29A0h8M';

// Función para hacer peticiones a Supabase
const supabaseFetch = async (endpoint, options = {}) => {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase error: ${response.status} - ${error}`);
  }
  
  return response.json();
};

// Obtener productos
const getProductos = async () => {
  const data = await supabaseFetch('productos?select=*&order=fecha.desc');
  return data.map(p => ({
    id: p.id,
    nombre: p.nombre,
    precio: Number(p.precio),
    descripcion: p.descripcion || '',
    imagen: p.imagen || '',
    video: p.video || '',
    enlaceDescarga: p.enlace_descarga || '',
    fecha: p.fecha
  }));
};

// Crear producto
const createProducto = async (producto) => {
  const data = await supabaseFetch('productos', {
    method: 'POST',
    body: JSON.stringify({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      video: producto.video,
      enlace_descarga: producto.enlaceDescarga
    })
  });
  return data;
};

// Actualizar producto
const updateProducto = async (id, producto) => {
  const data = await supabaseFetch(`productos?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      nombre: producto.nombre,
      precio: producto.precio,
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      video: producto.video,
      enlace_descarga: producto.enlaceDescarga
    })
  });
  return data;
};

// Eliminar producto
const deleteProducto = async (id) => {
  const data = await supabaseFetch(`productos?id=eq.${id}`, {
    method: 'DELETE'
  });
  return data;
};

// Función para enviar correo con Resend
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
// RUTAS API
// ============================================

// Test
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend funcionando',
    supabase: '✅',
    resend: process.env.RESEND_API_KEY ? '✅' : '❌'
  });
});

// Obtener productos
app.get('/api/productos', async (req, res) => {
  console.log('📋 GET /api/productos');
  try {
    const productos = await getProductos();
    console.log(`✅ ${productos.length} productos obtenidos`);
    res.json(productos);
  } catch (error) {
    console.error('❌ Error al obtener productos:', error.message);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Agregar producto
app.post('/api/productos', async (req, res) => {
  console.log('➕ POST /api/productos');
  try {
    const { nombre, precio, descripcion, imagen, video, enlaceDescarga } = req.body;
    if (!nombre || !precio) {
      return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    }
    
    const nuevo = {
      id: Date.now(),
      nombre: nombre.trim(),
      precio: Number(precio),
      descripcion: descripcion || '',
      imagen: imagen || '',
      video: video || '',
      enlaceDescarga: enlaceDescarga || ''
    };
    
    await createProducto(nuevo);
    console.log('✅ Producto agregado:', nuevo.nombre);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('❌ Error al agregar:', error.message);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});

// Actualizar producto
app.put('/api/productos/:id', async (req, res) => {
  console.log('✏️ PUT /api/productos/', req.params.id);
  try {
    const id = Number(req.params.id);
    const { nombre, precio, descripcion, imagen, video, enlaceDescarga } = req.body;
    
    await updateProducto(id, {
      nombre: nombre || '',
      precio: precio !== undefined ? Number(precio) : 0,
      descripcion: descripcion || '',
      imagen: imagen || '',
      video: video || '',
      enlaceDescarga: enlaceDescarga || ''
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error al actualizar:', error.message);
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

// Eliminar producto
app.delete('/api/productos/:id', async (req, res) => {
  console.log('🗑️ DELETE /api/productos/', req.params.id);
  try {
    const id = Number(req.params.id);
    await deleteProducto(id);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error al eliminar:', error.message);
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

// Enviar correo
app.post('/api/enviar-correo', async (req, res) => {
  console.log('📧 POST /api/enviar-correo');
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

    await enviarCorreoResend(
      'pdabasel1@gmail.com',
      `${asunto} - Prototipica Estudio`,
      html,
      datos.email
    );

    res.json({ success: true, message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('❌ Error al enviar correo:', error.message);
    res.status(500).json({ error: 'Error al enviar correo', details: error.message });
  }
});

// Stripe
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

// Webhook Stripe
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

// Servir frontend
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Iniciar
app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
  console.log(`📦 Supabase: ${SUPABASE_URL}`);
  console.log(`📧 Resend: ${process.env.RESEND_API_KEY ? '✅' : '❌'}`);
});
