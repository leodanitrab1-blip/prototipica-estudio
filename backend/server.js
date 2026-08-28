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

// ============================================
// 1. CORS - CONFIGURACIÓN OPTIMIZADA
// ============================================
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ============================================
// 2. MIDDLEWARE PARA PETICIONES JSON
// ============================================
app.use(express.json({ limit: '10mb' }));

// ============================================
// 3. BASE DE DATOS LOCAL (MEJORADA)
// ============================================
const DB_PATH = path.join(__dirname, '../data/productos.json');
const DATA_DIR = path.join(__dirname, '../data');

// Asegurar que la carpeta data existe
if (!fs.existsSync(DATA_DIR)) {
  console.log('📁 Creando carpeta data...');
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const leerProductos = () => {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      const productos = JSON.parse(data);
      return Array.isArray(productos) ? productos : [];
    }
  } catch (error) {
    console.error('❌ Error al leer productos:', error.message);
  }
  return [];
};

const guardarProductos = (productos) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(productos, null, 2), 'utf8');
    console.log(`💾 ${productos.length} productos guardados`);
    return true;
  } catch (error) {
    console.error('❌ Error al guardar productos:', error.message);
    return false;
  }
};

// Inicializar productos
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

// ============================================
// 4. CONFIGURACIÓN DE CORREO (MEJORADA)
// ============================================
const crearTransporter = () => {
  // Verificar variables de entorno
  if (!process.env.TU_CORREO || !process.env.CONTRASENA_APP) {
    console.error('❌ Variables de correo no configuradas');
    console.error('TU_CORREO:', process.env.TU_CORREO ? '✅' : '❌');
    console.error('CONTRASENA_APP:', process.env.CONTRASENA_APP ? '✅' : '❌');
    return null;
  }

  // Limpiar contraseña de espacios
  const password = process.env.CONTRASENA_APP.replace(/\s+/g, '');
  
  console.log('📧 Configurando transporter con:', process.env.TU_CORREO);

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Usar SSL
    auth: {
      user: process.env.TU_CORREO,
      pass: password
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    },
    connectionTimeout: 10000, // 10 segundos
    greetingTimeout: 10000,
    socketTimeout: 15000
  });
};

// ============================================
// 5. RUTAS DE API
// ============================================

// 5.1 Ruta de prueba mejorada
app.get('/api/test', (req, res) => {
  console.log('🔍 GET /api/test - OK');
  res.json({ 
    status: 'ok', 
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: {
      correo: process.env.TU_CORREO ? '✅' : '❌',
      password: process.env.CONTRASENA_APP ? '✅' : '❌',
      stripe: process.env.STRIPE_SECRET_KEY ? '✅' : '❌'
    }
  });
});

// 5.2 Obtener productos
app.get('/api/productos', (req, res) => {
  console.log('📋 GET /api/productos - Enviando', productosDB.length, 'productos');
  res.json(productosDB);
});

// 5.3 Agregar producto
app.post('/api/productos', (req, res) => {
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

// 5.4 Eliminar producto
app.delete('/api/productos/:id', (req, res) => {
  console.log('🗑️ DELETE /api/productos/', req.params.id);
  try {
    const id = Number(req.params.id);
    productosDB = productosDB.filter(p => p.id !== id);
    guardarProductos(productosDB);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

// 5.5 Actualizar producto
app.put('/api/productos/:id', (req, res) => {
  console.log('✏️ PUT /api/productos/', req.params.id);
  try {
    const id = Number(req.params.id);
    const index = productosDB.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
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

// 5.6 ENVIAR CORREO (MEJORADO)
app.post('/api/enviar-correo', async (req, res) => {
  console.log('📧 POST /api/enviar-correo');
  console.log('📝 Datos recibidos:', JSON.stringify(req.body, null, 2));
  
  try {
    const datos = req.body;
    
    // Validación mejorada
    if (!datos || !datos.email || !datos.email.includes('@')) {
      return res.status(400).json({ 
        success: false,
        error: 'Correo electrónico inválido' 
      });
    }

    // Verificar si el transporter se puede crear
    const transporter = crearTransporter();
    if (!transporter) {
      return res.status(500).json({ 
        success: false,
        error: 'Error al configurar el correo. Verifica las variables de entorno.' 
      });
    }

    // Verificar la conexión antes de enviar
    try {
      await transporter.verify();
      console.log('✅ Conexión con Gmail establecida');
    } catch (verifyError) {
      console.error('❌ Error al verificar conexión:', verifyError.message);
      return res.status(500).json({ 
        success: false,
        error: 'No se pudo conectar con Gmail. Verifica la contraseña de aplicación.',
        details: verifyError.message 
      });
    }

    const tipo = datos.tipo || 'contacto';
    const asunto = tipo === 'cotizacion' 
      ? '📋 Nueva Cotización' 
      : '📬 Nuevo Mensaje de Contacto';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #333; }
          .value { margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>${asunto}</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Nombre:</div>
              <div class="value">${datos.nombre || 'No especificado'}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${datos.email}</div>
            </div>
            ${datos.telefono ? `
            <div class="field">
              <div class="label">Teléfono:</div>
              <div class="value">${datos.telefono}</div>
            </div>` : ''}
            ${datos.presupuesto ? `
            <div class="field">
              <div class="label">Presupuesto:</div>
              <div class="value">$${datos.presupuesto} MXN</div>
            </div>` : ''}
            <div class="field">
              <div class="label">${tipo === 'cotizacion' ? 'Descripción' : 'Mensaje'}:</div>
              <div class="value">${datos.descripcion || datos.mensaje || 'No especificado'}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Prototipica Estudio" <${process.env.TU_CORREO}>`,
      to: process.env.TU_CORREO,
      replyTo: datos.email,
      subject: `${asunto} - Prototipica Estudio`,
      html: html,
      text: `Nuevo mensaje de ${datos.nombre || 'cliente'} (${datos.email})\n\n${datos.descripcion || datos.mensaje || 'Sin mensaje'}`
    };

    console.log('📧 Intentando enviar correo...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Correo enviado con éxito. ID:', info.messageId);
    
    res.json({ 
      success: true, 
      message: 'Correo enviado correctamente',
      messageId: info.messageId 
    });
    
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      success: false,
      error: 'Error al enviar correo', 
      details: error.message 
    });
  }
});

// 5.7 STRIPE - Crear sesión de pago
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/api/crear-sesion-pago', async (req, res) => {
  console.log('🔍 POST /api/crear-sesion-pago');
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

    console.log('✅ Sesión creada:', session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error('❌ Error en Stripe:', error);
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
});

// 5.8 WEBHOOK DE STRIPE
app.post('/api/webhook-stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log('🔔 Webhook recibido');
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
        const transporter = crearTransporter();
        if (transporter) {
          await transporter.sendMail({
            from: `"Prototipica Estudio" <${process.env.TU_CORREO}>`,
            to: email,
            subject: `✅ Tu compra de "${producto}" está lista`,
            html: `
              <h2>🎉 ¡Gracias por tu compra!</h2>
              <p>Tu pago ha sido procesado correctamente.</p>
              <p><strong>Producto:</strong> ${producto}</p>
              <p><a href="${enlaceDescarga}" style="background:#1a1a1a;color:white;padding:10px 20px;border-radius:40px;text-decoration:none;">📥 Descargar software</a></p>
            `
          });
          console.log('✅ Correo de descarga enviado a:', email);
        }
      }
    }
    res.json({ received: true });
  } catch (error) {
    console.error('❌ Error en webhook:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

// ============================================
// 6. SERVIR FRONTEND
// ============================================
app.use(express.static(path.join(__dirname, '../dist')));

// Ruta catch-all para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ============================================
// 7. INICIAR SERVIDOR
// ============================================
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📦 Productos cargados: ${productosDB.length}`);
  console.log(`📧 Correo configurado: ${process.env.TU_CORREO ? '✅' : '❌'}`);
  console.log(`🔑 Contraseña app: ${process.env.CONTRASENA_APP ? '✅' : '❌'}`);
  console.log(`💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? '✅' : '❌'}`);
  console.log(`🔔 Webhook: ${process.env.STRIPE_WEBHOOK_SECRET ? '✅' : '❌'}`);
  console.log('=================================');
});