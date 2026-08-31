import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import fs from 'fs';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));

// ========== BASE DE DATOS - PRODUCTOS ==========
const DB_PATH = path.join(__dirname, '../data/productos.json');
const DATA_DIR = path.join(__dirname, '../data');

if (!fs.existsSync(DATA_DIR)) {
  console.log('📁 Creando carpeta data...');
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
    console.log(`💾 ${productos.length} productos guardados`);
    return true;
  } catch (error) {
    console.error('Error al guardar productos:', error.message);
    return false;
  }
};

let productosDB = leerProductos();
if (productosDB.length === 0) {
  console.log('📦 Creando productos de ejemplo...');
  productosDB = [
    {
      id: 1,
      nombre: 'Sistema POS Pro',
      precio: 2999,
      descripcion: 'Sistema de punto de venta para restaurantes y tiendas',
      imagen: 'https://placehold.co/600x400/1a1a1a/ffffff?text=POS+Pro',
      video: '',
      enlaceDescarga: 'https://ejemplo.com/descargas/pos-pro.zip',
      fecha: new Date().toISOString()
    },
    {
      id: 2,
      nombre: 'Gestor de Proyectos Ágil',
      precio: 1499,
      descripcion: 'Herramienta de gestión con metodología ágil',
      imagen: 'https://placehold.co/600x400/333333/ffffff?text=Gestor+Ágil',
      video: '',
      enlaceDescarga: 'https://ejemplo.com/descargas/gestor-agil.zip',
      fecha: new Date().toISOString()
    }
  ];
  guardarProductos(productosDB);
}

// ========== BASE DE DATOS - NOTICIAS ==========
const NOTICIAS_PATH = path.join(__dirname, '../data/noticias.json');

const leerNoticias = () => {
  try {
    if (fs.existsSync(NOTICIAS_PATH)) {
      const data = fs.readFileSync(NOTICIAS_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error al leer noticias:', error.message);
  }
  return [];
};

const guardarNoticias = (noticias) => {
  try {
    fs.writeFileSync(NOTICIAS_PATH, JSON.stringify(noticias, null, 2));
    console.log(`💾 ${noticias.length} noticias guardadas`);
    return true;
  } catch (error) {
    console.error('Error al guardar noticias:', error.message);
    return false;
  }
};

let noticiasDB = leerNoticias();
if (noticiasDB.length === 0) {
  console.log('📰 Creando noticias de ejemplo...');
  noticiasDB = [
    {
      id: 1,
      titulo: '🚀 Bienvenidos a Prototipica Estudio',
      contenido: 'Este es nuestro nuevo sitio web. Aquí compartiremos noticias y actualizaciones.',
      imagen: 'https://placehold.co/800x400/1a1a1a/ffffff?text=Prototipica',
      video: '',
      fecha: new Date().toISOString()
    }
  ];
  guardarNoticias(noticiasDB);
}

// ========== CORREO ==========
const crearTransporter = () => {
  if (!process.env.TU_CORREO || !process.env.CONTRASENA_APP) {
    console.error('Variables de correo no configuradas');
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

// ========== RUTAS ==========
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', message: 'Backend funcionando', timestamp: new Date().toISOString() });
});

// === PRODUCTOS ===
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
  try {
    const id = Number(req.params.id);
    productosDB = productosDB.filter(p => p.id !== id);
    guardarProductos(productosDB);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

app.put('/api/productos/:id', (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

// === NOTICIAS ===
app.get('/api/noticias', (req, res) => {
  res.json(noticiasDB);
});

app.post('/api/noticias', (req, res) => {
  try {
    const { titulo, contenido, imagen, video } = req.body;
    if (!titulo || !contenido) return res.status(400).json({ error: 'Título y contenido son obligatorios' });
    const nueva = {
      id: Date.now(),
      titulo: titulo.trim(),
      contenido: contenido.trim(),
      imagen: imagen || '',
      video: video || '',
      fecha: new Date().toISOString()
    };
    noticiasDB.push(nueva);
    guardarNoticias(noticiasDB);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar noticia' });
  }
});

app.delete('/api/noticias/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    noticiasDB = noticiasDB.filter(n => n.id !== id);
    guardarNoticias(noticiasDB);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar noticia' });
  }
});

app.put('/api/noticias/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const index = noticiasDB.findIndex(n => n.id === id);
    if (index === -1) return res.status(404).json({ error: 'Noticia no encontrada' });
    const { titulo, contenido, imagen, video } = req.body;
    noticiasDB[index] = {
      ...noticiasDB[index],
      titulo: titulo || noticiasDB[index].titulo,
      contenido: contenido || noticiasDB[index].contenido,
      imagen: imagen !== undefined ? imagen : noticiasDB[index].imagen,
      video: video !== undefined ? video : noticiasDB[index].video
    };
    guardarNoticias(noticiasDB);
    res.json(noticiasDB[index]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar noticia' });
  }
});

// === CORREO ===
app.post('/api/enviar-correo', async (req, res) => {
  console.log('📧 POST /api/enviar-correo');
  try {
    const datos = req.body;
    if (!datos || !datos.email) return res.status(400).json({ error: 'Falta el correo electrónico' });
    const transporter = crearTransporter();
    if (!transporter) return res.status(500).json({ error: 'Error al configurar el correo' });
    const tipo = datos.tipo || 'contacto';
    const asunto = tipo === 'cotizacion' ? '📋 Nueva Cotización' : '📬 Nuevo Mensaje de Contacto';
    const html = `<h2>${asunto}</h2><p><strong>Nombre:</strong> ${datos.nombre || 'No especificado'}</p><p><strong>Email:</strong> ${datos.email}</p>${datos.telefono ? `<p><strong>Teléfono:</strong> ${datos.telefono}</p>` : ''}${datos.presupuesto ? `<p><strong>Presupuesto:</strong> $${datos.presupuesto} MXN</p>` : ''}<p><strong>${tipo === 'cotizacion' ? 'Descripción' : 'Mensaje'}:</strong></p><p>${datos.descripcion || datos.mensaje || 'No especificado'}</p>`;
    const mailOptions = { from: `"Prototipica Estudio" <${process.env.TU_CORREO}>`, to: process.env.TU_CORREO, replyTo: datos.email, subject: `${asunto} - Prototipica Estudio`, html };
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('Error en correo:', error);
    res.status(500).json({ error: 'Error al enviar correo', details: error.message });
  }
});

// === STRIPE ===
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/api/crear-sesion-pago', async (req, res) => {
  try {
    const { nombre, precio, descripcion, email, enlaceDescarga } = req.body;
    if (!nombre || !precio || precio <= 0) return res.status(400).json({ error: 'Datos del producto inválidos' });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [{ price_data: { currency: 'mxn', product_data: { name: nombre, description: descripcion || 'Software' }, unit_amount: Math.round(precio * 100) }, quantity: 1 }],
      mode: 'payment',
      success_url: 'https://prototipica-estudio.onrender.com?success=true',
      cancel_url: 'https://prototipica-estudio.onrender.com?canceled=true',
      metadata: { producto: nombre, enlace_descarga: enlaceDescarga || 'https://prototipica-estudio.onrender.com' }
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error en Stripe:', error);
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
});

app.post('/api/webhook-stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  try {
    let event;
    if (webhookSecret) event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    else event = JSON.parse(req.body.toString());
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const email = session.customer_details?.email || session.customer_email;
      const producto = session.metadata?.producto || 'Software';
      const enlaceDescarga = session.metadata?.enlace_descarga || 'https://prototipica-estudio.onrender.com';
      if (email && process.env.TU_CORREO) {
        const transporter = crearTransporter();
        if (transporter) {
          await transporter.sendMail({
            from: `"Prototipica Estudio" <${process.env.TU_CORREO}>`,
            to: email,
            subject: `✅ Tu compra de "${producto}" está lista`,
            html: `<h2>🎉 ¡Gracias por tu compra!</h2><p>Tu pago ha sido procesado correctamente.</p><p><strong>Producto:</strong> ${producto}</p><p><a href="${enlaceDescarga}" style="background:#1a1a1a;color:white;padding:10px 20px;border-radius:40px;text-decoration:none;">📥 Descargar software</a></p>`
          });
          console.log('✅ Correo de descarga enviado a:', email);
        }
      }
    }
    res.json({ received: true });
  } catch (error) {
    console.error('Error en webhook:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

// === FRONTEND ===
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📦 Productos cargados: ${productosDB.length}`);
  console.log(`📰 Noticias cargadas: ${noticiasDB.length}`);
  console.log(`📧 TU_CORREO: ${process.env.TU_CORREO || '❌ No configurado'}`);
  console.log(`💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? '✅' : '❌'}`);
  console.log(`🔔 Webhook: ${process.env.STRIPE_WEBHOOK_SECRET ? '✅' : '❌'}`);
});
