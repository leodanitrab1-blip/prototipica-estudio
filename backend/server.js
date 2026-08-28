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

// ==========================================
// 1. CONFIGURACIÓN DE CORS (PERMITIR TODO)
// ==========================================
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
app.use(express.json({ limit: '10mb' }));

// ==========================================
// 2. BASE DE DATOS LOCAL (archivo JSON)
// ==========================================
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
      const productos = JSON.parse(data);
      console.log(`📦 ${productos.length} productos cargados desde archivo`);
      return productos;
    }
  } catch (error) {
    console.error('❌ Error al leer productos:', error.message);
  }
  return [];
};

const guardarProductos = (productos) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(productos, null, 2));
    console.log(`💾 ${productos.length} productos guardados en archivo`);
    return true;
  } catch (error) {
    console.error('❌ Error al guardar productos:', error.message);
    return false;
  }
};

let productosDB = leerProductos();
if (productosDB.length === 0) {
  console.log('📦 No hay productos, creando ejemplos...');
  const ejemplos = [
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
  guardarProductos(ejemplos);
  productosDB = ejemplos;
}

// ==========================================
// 3. CONFIGURACIÓN DE CORREO
// ==========================================
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

// ==========================================
// 4. RUTAS DE LA API
// ==========================================

// Obtener todos los productos
app.get('/api/productos', (req, res) => {
  console.log('📋 GET /api/productos - Enviando', productosDB.length, 'productos');
  res.json(productosDB);
});

// Agregar producto
app.post('/api/productos', (req, res) => {
  console.log('➕ POST /api/productos - Recibiendo producto');
  console.log('📦 Datos:', req.body);
  
  try {
    const { nombre, precio, descripcion, imagen, video, enlaceDescarga } = req.body;
    
    if (!nombre || !precio) {
      console.log('❌ Faltan datos obligatorios');
      return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    }

    const nuevoProducto = {
      id: Date.now(),
      nombre: nombre.trim(),
      precio: Number(precio),
      descripcion: descripcion || '',
      imagen: imagen || '',
      video: video || '',
      enlaceDescarga: enlaceDescarga || '',
      fecha: new Date().toISOString()
    };

    console.log('✅ Producto creado:', nuevoProducto);

    productosDB.push(nuevoProducto);
    guardarProductos(productosDB);
    
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('❌ Error al agregar producto:', error);
    res.status(500).json({ error: 'Error al agregar producto: ' + error.message });
  }
});

// Eliminar producto
app.delete('/api/productos/:id', (req, res) => {
  console.log('🗑️ DELETE /api/productos/', req.params.id);
  try {
    const id = Number(req.params.id);
    productosDB = productosDB.filter(p => p.id !== id);
    guardarProductos(productosDB);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error al eliminar:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// Actualizar producto
app.put('/api/productos/:id', (req, res) => {
  console.log('✏️ PUT /api/productos/', req.params.id);
  try {
    const id = Number(req.params.id);
    const { nombre, precio, descripcion, imagen, video, enlaceDescarga } = req.body;
    
    const index = productosDB.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

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
    console.error('❌ Error al actualizar:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// ==========================================
// 5. ENVÍO DE CORREO (CONTACTO Y COTIZACIÓN)
// ==========================================
app.post('/api/enviar-correo', async (req, res) => {
  console.log('📧 Recibida solicitud de correo');
  console.log('📝 Datos recibidos:', req.body);
  
  try {
    const datos = req.body;
    if (!datos || !datos.email) {
      console.log('❌ Falta el correo electrónico');
      return res.status(400).json({ error: 'Falta el correo electrónico' });
    }

    const transporter = crearTransporter();
    if (!transporter) {
      console.log('❌ Error al configurar el transporter');
      return res.status(500).json({ error: 'Error al configurar el correo' });
    }

    const tipo = datos.tipo || 'contacto';
    const asunto = tipo === 'cotizacion' 
      ? '📋 Nueva Cotización - Prototipica Estudio' 
      : '📬 Nuevo Mensaje de Contacto - Prototipica Estudio';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 25px; border-radius: 0 0 8px 8px; border: 1px solid #ddd; }
          .campo { margin-bottom: 12px; }
          .campo-label { font-weight: bold; color: #555; }
          .campo-valor { margin-left: 8px; color: #1a1a1a; }
          .footer { margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${tipo === 'cotizacion' ? '📋 Nueva Cotización' : '📬 Nuevo Mensaje de Contacto'}</h1>
          <p>Prototipica Estudio</p>
        </div>
        <div class="content">
          <div class="campo">
            <span class="campo-label">👤 Nombre:</span>
            <span class="campo-valor">${datos.nombre || 'No especificado'}</span>
          </div>
          <div class="campo">
            <span class="campo-label">📧 Email:</span>
            <span class="campo-valor">${datos.email}</span>
          </div>
          ${datos.telefono ? `<div class="campo"><span class="campo-label">📱 Teléfono:</span><span class="campo-valor">${datos.telefono}</span></div>` : ''}
          ${datos.presupuesto ? `<div class="campo"><span class="campo-label">💰 Presupuesto:</span><span class="campo-valor">$${Number(datos.presupuesto).toLocaleString('es-MX')} MXN</span></div>` : ''}
          <hr>
          <div class="campo">
            <span class="campo-label">📝 ${tipo === 'cotizacion' ? 'Descripción del proyecto:' : 'Mensaje:'}</span>
            <div style="background: white; padding: 12px; border-radius: 6px; margin-top: 6px; border: 1px solid #eee;">
              ${datos.descripcion || datos.mensaje || 'No especificado'}
            </div>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Prototipica Estudio</p>
          <p>Responder a: ${datos.email}</p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Prototipica Estudio" <${process.env.TU_CORREO}>`,
      to: process.env.TU_CORREO,
      replyTo: datos.email,
      subject: asunto,
      html: html,
      text: `Nuevo mensaje de ${datos.nombre || 'cliente'} (${datos.email})\n\n${datos.descripcion || datos.mensaje || ''}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Correo enviado:', info.messageId);
    res.json({ success: true, message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
    res.status(500).json({ 
      error: 'Error al enviar correo', 
      details: error.message 
    });
  }
});

// ==========================================
// 6. STRIPE (PAGOS)
// ==========================================
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/api/crear-sesion-pago', async (req, res) => {
  console.log('🔍 Recibida solicitud de pago');
  console.log('📦 Producto:', req.body);
  
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
            description: descripcion || 'Software de Prototipica Estudio'
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

    console.log('✅ Sesión creada:', session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error('❌ Error en Stripe:', error);
    res.status(500).json({ error: 'Error al procesar el pago: ' + error.message });
  }
});

// ==========================================
// 7. WEBHOOK DE STRIPE (Entrega automática)
// ==========================================
app.post('/api/webhook-stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log('🔔 Webhook recibido');

  try {
    let event;
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = JSON.parse(req.body.toString());
    }

    console.log('📦 Evento:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const email = session.customer_details?.email || session.customer_email;
      const producto = session.metadata?.producto || 'Software';
      const enlaceDescarga = session.metadata?.enlace_descarga || 'https://prototipica-estudio.onrender.com';

      console.log(`💰 Pago exitoso: ${email} compró ${producto}`);

      if (email && process.env.TU_CORREO) {
        const transporter = crearTransporter();
        if (transporter) {
          try {
            await transporter.sendMail({
              from: `"Prototipica Estudio" <${process.env.TU_CORREO}>`,
              to: email,
              subject: `✅ Tu compra de "${producto}" está lista`,
              html: `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                  <style>
                    body { font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #1a1a1a; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
                    .content { background: #f9f9f9; padding: 25px; border-radius: 0 0 8px 8px; border: 1px solid #ddd; }
                    .btn { display: inline-block; background: #1a1a1a; color: white; padding: 12px 30px; border-radius: 40px; text-decoration: none; font-weight: 500; }
                    .footer { margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #999; }
                  </style>
                </head>
                <body>
                  <div class="header">
                    <h1>🎉 ¡Gracias por tu compra!</h1>
                    <p>Prototipica Estudio</p>
                  </div>
                  <div class="content">
                    <h2>${producto}</h2>
                    <p>Tu pago ha sido procesado correctamente. Haz clic en el botón para descargar tu software:</p>
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${enlaceDescarga}" class="btn">📥 Descargar software</a>
                    </div>
                    <p style="font-size: 14px; color: #666;">
                      <strong>Instrucciones:</strong><br>
                      1. Descarga el archivo<br>
                      2. Descomprime en tu computadora<br>
                      3. Sigue las instrucciones de instalación
                    </p>
                    <p style="font-size: 14px; color: #666;">
                      <strong>Licencia:</strong> Este software es de uso personal. No compartas el enlace de descarga.
                    </p>
                  </div>
                  <div class="footer">
                    <p>© 2026 Prototipica Estudio</p>
                    <p>${process.env.TU_CORREO}</p>
                  </div>
                </body>
                </html>
              `
            });
            console.log('✅ Correo de descarga enviado a:', email);
          } catch (error) {
            console.error('❌ Error al enviar correo de descarga:', error);
          }
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Error en webhook:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

// ==========================================
// 8. SERVIR FRONTEND (Siempre al final)
// ==========================================
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ==========================================
// 9. INICIAR SERVIDOR
// ==========================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📦 Productos cargados: ${productosDB.length}`);
  console.log(`📁 DB Path: ${DB_PATH}`);
  console.log(`📧 TU_CORREO: ${process.env.TU_CORREO || '❌ No configurado'}`);
  console.log(`💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? '✅ Configurado' : '❌ No configurado'}`);
  console.log(`🔔 Webhook: ${process.env.STRIPE_WEBHOOK_SECRET ? '✅ Configurado' : '❌ No configurado'}`);
});