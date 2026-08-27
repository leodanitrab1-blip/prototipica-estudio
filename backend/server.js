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

// ==========================================
// 1. CONFIGURACIÓN INICIAL
// ==========================================
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ==========================================
// 2. BASE DE DATOS LOCAL (archivo JSON)
// ==========================================
const DB_PATH = path.join(__dirname, '../data/productos.json');

// Crear carpeta data si no existe
if (!fs.existsSync(path.join(__dirname, '../data'))) {
  fs.mkdirSync(path.join(__dirname, '../data'));
}

// Leer productos del archivo
const leerProductos = () => {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error al leer productos:', error);
  }
  return [];
};

// Guardar productos en el archivo
const guardarProductos = (productos) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(productos, null, 2));
    return true;
  } catch (error) {
    console.error('Error al guardar productos:', error);
    return false;
  }
};

// Inicializar con productos de ejemplo si no hay
const inicializarProductos = () => {
  const productos = leerProductos();
  if (productos.length === 0) {
    const ejemplos = [
      {
        id: 1,
        nombre: 'Sistema POS Pro',
        precio: 2999,
        descripcion: 'Sistema de punto de venta para restaurantes y tiendas',
        imagen: 'https://placehold.co/600x400/1a1a1a/ffffff?text=POS+Pro',
        video: '',
        fecha: new Date().toISOString()
      },
      {
        id: 2,
        nombre: 'Gestor de Proyectos Ágil',
        precio: 1499,
        descripcion: 'Herramienta de gestión con metodología ágil',
        imagen: 'https://placehold.co/600x400/333333/ffffff?text=Gestor+Ágil',
        video: '',
        fecha: new Date().toISOString()
      }
    ];
    guardarProductos(ejemplos);
    return ejemplos;
  }
  return productos;
};

let productosDB = inicializarProductos();

// ==========================================
// 3. RUTAS DE LA API
// ==========================================

// Obtener todos los productos
app.get('/api/productos', (req, res) => {
  res.json(productosDB);
});

// Agregar producto
app.post('/api/productos', (req, res) => {
  try {
    const { nombre, precio, descripcion, imagen, video } = req.body;
    
    if (!nombre || !precio) {
      return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    }

    const nuevoProducto = {
      id: Date.now(),
      nombre,
      precio: Number(precio),
      descripcion: descripcion || '',
      imagen: imagen || '',
      video: video || '',
      fecha: new Date().toISOString()
    };

    productosDB.push(nuevoProducto);
    guardarProductos(productosDB);
    
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});

// Eliminar producto
app.delete('/api/productos/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    productosDB = productosDB.filter(p => p.id !== id);
    guardarProductos(productosDB);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// Actualizar producto
app.put('/api/productos/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, precio, descripcion, imagen, video } = req.body;
    
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
      video: video !== undefined ? video : productosDB[index].video
    };

    guardarProductos(productosDB);
    res.json(productosDB[index]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// ==========================================
// 4. STRIPE (PAGOS)
// ==========================================
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/api/crear-sesion-pago', async (req, res) => {
  console.log('🔍 Recibida solicitud de pago');
  
  try {
    const { nombre, precio, descripcion } = req.body;

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
      success_url: 'https://prototipica-estudio.onrender.com?success=true',
      cancel_url: 'https://prototipica-estudio.onrender.com?canceled=true',
    });

    console.log('✅ Sesión creada:', session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error('❌ Error en Stripe:', error);
    res.status(500).json({ error: 'Error al procesar el pago: ' + error.message });
  }
});

// ==========================================
// 5. SERVIR FRONTEND (Siempre al final)
// ==========================================
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ==========================================
// 6. INICIAR SERVIDOR
// ==========================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📦 Productos cargados: ${productosDB.length}`);
  console.log(`💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? '✅' : '❌'}`);
});