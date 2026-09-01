// ============================================
// CONFIGURACIÓN DE FIREBASE (CON CDN)
// ============================================
// Firebase ya está cargado en index.html
// Aquí solo accedemos a las instancias globales

// La configuración de Firebase (copiada de tu proyecto)
const firebaseConfig = {
  apiKey: "AIzaSyCkI0sZYYxTk8y0v8EI31dmlRML5QCI_c8",
  authDomain: "prototipica-b8e56.firebaseapp.com",
  projectId: "prototipica-b8e56",
  storageBucket: "prototipica-b8e56.firebasestorage.app",
  messagingSenderId: "546222793291",
  appId: "1:546222793291:web:356fa3d6bfaa30b4eea3ce"
};

// Inicializar Firebase (usando la versión compat del CDN)
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// ============================================
// FUNCIONES PARA PRODUCTOS
// ============================================

export const getProductos = async () => {
  try {
    const querySnapshot = await db.collection('productos').orderBy('fecha', 'desc').get();
    const productos = [];
    querySnapshot.forEach((doc) => {
      productos.push({ id: doc.id, ...doc.data() });
    });
    return productos;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
};

export const addProducto = async (producto) => {
  try {
    const docRef = await db.collection('productos').add(producto);
    return { id: docRef.id, ...producto };
  } catch (error) {
    console.error('Error al agregar producto:', error);
    throw error;
  }
};

export const deleteProducto = async (id) => {
  try {
    await db.collection('productos').doc(id).delete();
    return true;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};

export const updateProducto = async (id, data) => {
  try {
    await db.collection('productos').doc(id).update(data);
    return true;
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

// ============================================
// FUNCIONES PARA NOTICIAS
// ============================================

export const getNoticias = async () => {
  try {
    const querySnapshot = await db.collection('noticias').orderBy('fecha', 'desc').get();
    const noticias = [];
    querySnapshot.forEach((doc) => {
      noticias.push({ id: doc.id, ...doc.data() });
    });
    return noticias;
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    return [];
  }
};

export const addNoticia = async (noticia) => {
  try {
    const docRef = await db.collection('noticias').add(noticia);
    return { id: docRef.id, ...noticia };
  } catch (error) {
    console.error('Error al agregar noticia:', error);
    throw error;
  }
};

export const deleteNoticia = async (id) => {
  try {
    await db.collection('noticias').doc(id).delete();
    return true;
  } catch (error) {
    console.error('Error al eliminar noticia:', error);
    throw error;
  }
};

export const updateNoticia = async (id, data) => {
  try {
    await db.collection('noticias').doc(id).update(data);
    return true;
  } catch (error) {
    console.error('Error al actualizar noticia:', error);
    throw error;
  }
};

export default { getProductos, addProducto, deleteProducto, updateProducto, getNoticias, addNoticia, deleteNoticia, updateNoticia };
