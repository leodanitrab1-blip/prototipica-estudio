import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { FiShoppingCart, FiPlus, FiTrash2, FiX, FiLock, FiEdit3, FiPackage, FiDollarSign, FiDownload, FiImage, FiVideo } from 'react-icons/fi';

const STRIPE_PUBLIC_KEY = 'pk_live_51U92vNBaY3CV3QUxUdcDY3Flu9HKKwX5qPtlrk3v3aJE2Ocm4HoEhRfCXKjvWu4XVIys1nzZhcdAivgg0OaQYhim00AIhSEiky';

export default function TiendaSoftware({ idioma }) {
  const [productos, setProductos] = useState([]);
  const [modoAdmin, setModoAdmin] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [cargandoPago, setCargandoPago] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    imagen: '',
    video: '',
    enlaceDescarga: ''
  });
  const [emailCliente, setEmailCliente] = useState('');
  const [mostrarModalEmail, setMostrarModalEmail] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  
  const ADMIN_PASSWORD = 'prototipica2026';

  const textos = {
    es: {
      titulo: 'MarketSoft',
      productos: 'productos',
      admin: 'Admin',
      cargando: 'Cargando productos...',
      accesoAdmin: 'Acceso de administrador',
      ingresaPassword: 'Ingresa la contraseña para administrar los productos.',
      contraseña: 'Contraseña...',
      ingresar: 'Ingresar',
      cancelar: 'Cancelar',
      editorProductos: 'Editor de Productos',
      nuevo: 'Nuevo',
      cerrar: 'Cerrar',
      agregarProducto: 'Agregar nuevo producto',
      nombre: 'Nombre del producto',
      precio: 'Precio (MXN)',
      descripcion: 'Descripción',
      imagen: 'URL de imagen',
      video: 'URL de video',
      enlaceDescarga: 'Enlace de descarga',
      guardar: 'Guardar producto',
      eliminar: 'Eliminar',
      noHayProductos: 'No hay productos disponibles',
      hazClic: 'Haz clic en "MarketSoft" para acceder al panel',
      comprar: 'Comprar ahora',
      procesando: 'Procesando...',
      confirmarCompra: 'Confirmar compra',
      recibirasEnlace: 'Recibirás el enlace de descarga en tu correo después del pago.',
      tuCorreo: 'Tu correo electrónico',
      pagarAhora: 'Pagar ahora',
      errorPassword: 'Contraseña incorrecta',
      errorCampos: 'Todos los campos son obligatorios.',
      errorServidor: 'Error al cargar productos',
      errorConexion: 'Error de conexión con el servidor',
      eliminarConfirm: '¿Eliminar este software?'
    },
    en: {
      titulo: 'MarketSoft',
      productos: 'products',
      admin: 'Admin',
      cargando: 'Loading products...',
      accesoAdmin: 'Admin Access',
      ingresaPassword: 'Enter password to manage products.',
      contraseña: 'Password...',
      ingresar: 'Login',
      cancelar: 'Cancel',
      editorProductos: 'Product Editor',
      nuevo: 'New',
      cerrar: 'Close',
      agregarProducto: 'Add new product',
      nombre: 'Product name',
      precio: 'Price (MXN)',
      descripcion: 'Description',
      imagen: 'Image URL',
      video: 'Video URL',
      enlaceDescarga: 'Download link',
      guardar: 'Save product',
      eliminar: 'Delete',
      noHayProductos: 'No products available',
      hazClic: 'Click on "MarketSoft" to access the panel',
      comprar: 'Buy now',
      procesando: 'Processing...',
      confirmarCompra: 'Confirm purchase',
      recibirasEnlace: 'You will receive the download link in your email after payment.',
      tuCorreo: 'Your email',
      pagarAhora: 'Pay now',
      errorPassword: 'Incorrect password',
      errorCampos: 'All fields are required.',
      errorServidor: 'Error loading products',
      errorConexion: 'Connection error with server',
      eliminarConfirm: 'Delete this software?'
    }
  };

  const t = textos[idioma] || textos.es;

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      setError('');
      const response = await fetch('/api/productos');
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      } else {
        setError(t.errorServidor);
      }
    } catch (error) {
      setError(t.errorConexion);
    } finally {
      setCargando(false);
    }
  };

  const abrirFormulario = () => {
    setNuevoProducto({
      nombre: '',
      precio: '',
      descripcion: '',
      imagen: '',
      video: '',
      enlaceDescarga: ''
    });
    setMostrarFormulario(true);
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setNuevoProducto({
      nombre: '',
      precio: '',
      descripcion: '',
      imagen: '',
      video: '',
      enlaceDescarga: ''
    });
    // Restaurar scroll del body
    document.body.style.overflow = 'unset';
  };

  const guardarProducto = async () => {
    if (!nuevoProducto.nombre.trim()) {
      alert('❌ ' + t.nombre + ' es obligatorio');
      return;
    }
    if (!nuevoProducto.precio || parseFloat(nuevoProducto.precio) <= 0) {
      alert('❌ ' + t.precio + ' debe ser mayor a 0');
      return;
    }

    try {
      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nuevoProducto.nombre.trim(),
          precio: parseFloat(nuevoProducto.precio),
          descripcion: nuevoProducto.descripcion.trim() || 'Sin descripción',
          imagen: nuevoProducto.imagen.trim() || '',
          video: nuevoProducto.video.trim() || '',
          enlaceDescarga: nuevoProducto.enlaceDescarga.trim() || ''
        })
      });
      
      if (response.ok) {
        const producto = await response.json();
        setProductos([...productos, producto]);
        cerrarFormulario();
        alert('✅ Producto agregado correctamente');
      } else {
        const errorData = await response.json();
        alert('❌ Error al agregar: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      alert('❌ Error de conexión');
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm(t.eliminarConfirm)) return;
    try {
      const response = await fetch(`/api/productos/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setProductos(productos.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const actualizarProducto = async (id, campo, valor) => {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    const actualizado = { ...producto, [campo]: valor };
    try {
      const response = await fetch(`/api/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actualizado)
      });
      if (response.ok) {
        setProductos(productos.map(p => p.id === id ? actualizado : p));
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  const handleTituloClick = () => {
    setMostrarLogin(true);
    setPassword('');
    setErrorPassword('');
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setModoAdmin(true);
      setMostrarLogin(false);
      setPassword('');
      setErrorPassword('');
    } else {
      setErrorPassword('❌ ' + t.errorPassword);
    }
  };

  const iniciarPago = (producto) => {
    setProductoSeleccionado(producto);
    setEmailCliente('');
    setMostrarModalEmail(true);
  };

  const procesarPago = async () => {
    if (!emailCliente || !emailCliente.includes('@')) {
      alert('❌ ' + t.tuCorreo + ' válido');
      return;
    }

    const producto = productoSeleccionado;
    setCargandoPago(true);
    setMostrarModalEmail(false);

    try {
      const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
      const response = await fetch('/api/crear-sesion-pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: producto.nombre,
          precio: producto.precio,
          descripcion: producto.descripcion,
          email: emailCliente,
          enlaceDescarga: producto.enlaceDescarga || 'https://prototipica-estudio.onrender.com'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear sesión');
      }

      const session = await response.json();
      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        alert('Error: ' + result.error.message);
      }
    } catch (error) {
      alert('Error al conectar con Stripe: ' + error.message);
    } finally {
      setCargandoPago(false);
    }
  };

  if (cargando) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem', 
        color: '#999',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #f0f0f0',
          borderTopColor: '#1a1a1a',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p>{t.cargando}</p>
      </div>
    );
  }

  const inputStyle = {
    width: '100%',
    padding: '0.7rem',
    border: '1px solid #ddd',
    borderRadius: '10px',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: "'Inter', sans-serif"
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem' }}>
      {/* Modal de Login */}
      {mostrarLogin && !modoAdmin && (
        <div style={{
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '400px',
            width: '100%',
            padding: '2rem',
            textAlign: 'center',
            animation: 'fadeInUp 0.3s ease',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: '#c9a96e',
              fontSize: '1.5rem'
            }}>
              <FiLock />
            </div>
            <h3 style={{ marginBottom: '0.5rem', fontFamily: "'Playfair Display', serif" }}>
              {t.accesoAdmin}
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {t.ingresaPassword}
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.contraseña}
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '1px solid #ddd',
                borderRadius: '12px',
                marginBottom: '0.8rem',
                fontSize: '1rem',
                outline: 'none'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            {errorPassword && (
              <p style={{ color: '#c62828', fontSize: '0.9rem', marginBottom: '0.8rem' }}>
                {errorPassword}
              </p>
            )}
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button
                onClick={handleLogin}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                  color: 'white',
                  padding: '0.8rem',
                  border: 'none',
                  borderRadius: '40px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                {t.ingresar}
              </button>
              <button
                onClick={() => {
                  setMostrarLogin(false);
                  setPassword('');
                  setErrorPassword('');
                }}
                style={{
                  flex: 1,
                  background: '#eee',
                  color: '#333',
                  padding: '0.8rem',
                  border: 'none',
                  borderRadius: '40px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                {t.cancelar}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para pedir email */}
      {mostrarModalEmail && productoSeleccionado && (
        <div style={{
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '400px',
            width: '100%',
            padding: '2rem',
            textAlign: 'center',
            animation: 'fadeInUp 0.3s ease',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ marginBottom: '0.5rem', fontFamily: "'Playfair Display', serif" }}>
              {t.confirmarCompra}
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
              {productoSeleccionado.nombre}
            </p>
            <p style={{ 
              color: '#1a1a1a', 
              fontSize: '2rem', 
              fontWeight: '700', 
              marginBottom: '1rem',
              fontFamily: "'Playfair Display', serif"
            }}>
              ${productoSeleccionado.precio.toLocaleString('es-MX')} MXN
            </p>
            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {t.recibirasEnlace}
            </p>
            <input
              type="email"
              value={emailCliente}
              onChange={(e) => setEmailCliente(e.target.value)}
              placeholder={t.tuCorreo}
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '1px solid #ddd',
                borderRadius: '12px',
                fontSize: '1rem',
                marginBottom: '1rem',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button
                onClick={procesarPago}
                disabled={cargandoPago}
                style={{
                  flex: 1,
                  background: cargandoPago ? '#888' : 'linear-gradient(135deg, #635bff 0%, #4a42e8 100%)',
                  color: 'white',
                  padding: '0.8rem',
                  border: 'none',
                  borderRadius: '40px',
                  cursor: cargandoPago ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  opacity: cargandoPago ? 0.7 : 1
                }}
              >
                {cargandoPago ? t.procesando : '✅ ' + t.pagarAhora}
              </button>
              <button
                onClick={() => {
                  setMostrarModalEmail(false);
                  setProductoSeleccionado(null);
                  setEmailCliente('');
                }}
                style={{
                  flex: 1,
                  background: '#eee',
                  color: '#333',
                  padding: '0.8rem',
                  border: 'none',
                  borderRadius: '40px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                {t.cancelar}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar producto - CORREGIDO */}
      {mostrarFormulario && (
        <div style={{
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          overflowY: 'auto'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '500px',
            width: '100%',
            padding: '2rem',
            maxHeight: '90vh',
            overflowY: 'auto',
            animation: 'fadeInUp 0.3s ease',
            margin: 'auto'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1.5rem',
              position: 'sticky',
              top: '-2rem',
              background: 'white',
              paddingTop: '0.5rem',
              zIndex: 1
            }}>
              <h3 style={{ 
                fontSize: '1.3rem', 
                fontWeight: '600',
                fontFamily: "'Playfair Display', serif",
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: 0
              }}>
                <FiPlus /> {t.agregarProducto}
              </h3>
              <button 
                onClick={cerrarFormulario} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '1.5rem', 
                  cursor: 'pointer', 
                  color: '#999',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease'
                }}
              >
                <FiX />
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                <FiPackage style={{ marginRight: '0.3rem', fontSize: '0.8rem' }} />
                {t.nombre} *
              </label>
              <input 
                type="text" 
                value={nuevoProducto.nombre} 
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })} 
                placeholder="Ej: Sistema POS Pro" 
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                <FiDollarSign style={{ marginRight: '0.3rem', fontSize: '0.8rem' }} />
                {t.precio} *
              </label>
              <input 
                type="number" 
                value={nuevoProducto.precio} 
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })} 
                placeholder="Ej: 2999" 
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                {t.descripcion}
              </label>
              <textarea 
                value={nuevoProducto.descripcion} 
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })} 
                placeholder="Describe el software..." 
                rows="3" 
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                <FiImage style={{ marginRight: '0.3rem', fontSize: '0.8rem' }} />
                {t.imagen}
              </label>
              <input 
                type="text" 
                value={nuevoProducto.imagen} 
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, imagen: e.target.value })} 
                placeholder="https://ejemplo.com/imagen.jpg" 
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                <FiVideo style={{ marginRight: '0.3rem', fontSize: '0.8rem' }} />
                {t.video}
              </label>
              <input 
                type="text" 
                value={nuevoProducto.video} 
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, video: e.target.value })} 
                placeholder="https://www.youtube.com/embed/VIDEO_ID" 
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                <FiDownload style={{ marginRight: '0.3rem', fontSize: '0.8rem' }} />
                {t.enlaceDescarga}
              </label>
              <input 
                type="text" 
                value={nuevoProducto.enlaceDescarga} 
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, enlaceDescarga: e.target.value })} 
                placeholder="https://ejemplo.com/descargas/software.zip" 
                style={inputStyle}
              />
              <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.3rem' }}>
                El cliente recibirá este enlace por correo después del pago.
              </p>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '0.8rem',
              position: 'sticky',
              bottom: '-2rem',
              background: 'white',
              paddingBottom: '0.5rem',
              zIndex: 1
            }}>
              <button 
                onClick={guardarProducto} 
                style={{ 
                  flex: 1, 
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', 
                  color: 'white', 
                  padding: '0.8rem', 
                  border: 'none', 
                  borderRadius: '40px', 
                  cursor: 'pointer', 
                  fontSize: '1rem', 
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                ✅ {t.guardar}
              </button>
              <button 
                onClick={cerrarFormulario} 
                style={{ 
                  flex: 1, 
                  background: '#eee', 
                  color: '#333', 
                  padding: '0.8rem', 
                  border: 'none', 
                  borderRadius: '40px', 
                  cursor: 'pointer', 
                  fontSize: '1rem' 
                }}
              >
                {t.cancelar}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        padding: '2rem 1rem',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        borderRadius: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(201,169,110,0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <h2 
          onClick={handleTituloClick} 
          style={{ 
            fontSize: '2rem', 
            fontWeight: '300', 
            cursor: 'pointer', 
            userSelect: 'none',
            color: 'white',
            fontFamily: "'Playfair Display', serif",
            marginBottom: '0.5rem',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          🛠️ {t.titulo}
          {modoAdmin && (
            <span style={{
              fontSize: '0.7rem',
              background: '#c9a96e',
              color: '#1a1a1a',
              padding: '0.2rem 0.8rem',
              borderRadius: '20px',
              fontWeight: '600'
            }}>
              {t.admin}
            </span>
          )}
        </h2>
        <p style={{ 
          color: '#ccc', 
          margin: 0,
          fontSize: '0.9rem',
          position: 'relative'
        }}>
          {productos.length} {t.productos}
        </p>
      </div>

      {error && (
        <div style={{
          background: '#fff0f0',
          border: '1px solid #ffcdd2',
          borderRadius: '12px',
          padding: '1rem 1.2rem',
          color: '#c62828',
          marginBottom: '1rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Panel Admin */}
      {modoAdmin && (
        <div style={{
          border: '2px dashed #1a1a1a',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem',
          background: '#fafafa',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1rem' 
          }}>
            <h3 style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              margin: 0,
              fontWeight: '600'
            }}>
              <FiEdit3 /> {t.editorProductos}
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={abrirFormulario} 
                style={{ 
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', 
                  color: 'white', 
                  padding: '0.5rem 1.2rem', 
                  border: 'none', 
                  borderRadius: '40px', 
                  cursor: 'pointer', 
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <FiPlus /> {t.nuevo}
              </button>
              <button 
                onClick={() => setModoAdmin(false)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#999', 
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {t.cerrar}
              </button>
            </div>
          </div>

          {productos.map((prod) => (
            <div key={prod.id} style={{ 
              border: '1px solid #eee', 
              padding: '1rem', 
              marginBottom: '1rem', 
              background: 'white', 
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <input 
                value={prod.nombre} 
                onChange={(e) => actualizarProducto(prod.id, 'nombre', e.target.value)} 
                placeholder={t.nombre} 
                style={{ ...inputStyle, marginBottom: '0.5rem' }}
              />
              <input 
                type="number" 
                value={prod.precio} 
                onChange={(e) => actualizarProducto(prod.id, 'precio', parseFloat(e.target.value))} 
                placeholder={t.precio} 
                style={{ ...inputStyle, marginBottom: '0.5rem' }}
              />
              <textarea 
                value={prod.descripcion} 
                onChange={(e) => actualizarProducto(prod.id, 'descripcion', e.target.value)} 
                placeholder={t.descripcion} 
                rows="2" 
                style={{ ...inputStyle, marginBottom: '0.5rem', resize: 'vertical' }}
              />
              <input 
                value={prod.imagen} 
                onChange={(e) => actualizarProducto(prod.id, 'imagen', e.target.value)} 
                placeholder={t.imagen} 
                style={{ ...inputStyle, marginBottom: '0.5rem' }}
              />
              <input 
                value={prod.video} 
                onChange={(e) => actualizarProducto(prod.id, 'video', e.target.value)} 
                placeholder={t.video} 
                style={{ ...inputStyle, marginBottom: '0.5rem' }}
              />
              <input 
                value={prod.enlaceDescarga || ''} 
                onChange={(e) => actualizarProducto(prod.id, 'enlaceDescarga', e.target.value)} 
                placeholder={t.enlaceDescarga} 
                style={{ ...inputStyle, marginBottom: '0.5rem' }}
              />
              <button 
                onClick={() => eliminarProducto(prod.id)} 
                style={{ 
                  background: '#ff4444', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.85rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <FiTrash2 size={14} /> {t.eliminar}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lista de productos */}
      {productos.length === 0 && !modoAdmin && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: '#999',
          background: '#fafafa',
          borderRadius: '16px'
        }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>📦 {t.noHayProductos}</p>
          <p style={{ fontSize: '0.9rem' }}>{t.hazClic}</p>
        </div>
      )}

      {productos.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {productos.map((prod) => (
            <div key={prod.id} style={{ 
              border: '1px solid #eee', 
              borderRadius: '20px', 
              overflow: 'hidden', 
              transition: 'all 0.3s ease', 
              background: 'white',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            }}>
              {prod.imagen && (
                <img 
                  src={prod.imagen} 
                  alt={prod.nombre} 
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover',
                    display: 'block'
                  }} 
                  onError={(e) => { e.target.style.display = 'none'; }} 
                />
              )}
              {prod.video && (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                  <iframe 
                    src={prod.video} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} 
                    allowFullScreen 
                    title={prod.nombre} 
                  />
                </div>
              )}
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  fontFamily: "'Playfair Display', serif"
                }}>
                  {prod.nombre}
                </h3>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                  {prod.descripcion}
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '1rem' 
                }}>
                  <span style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700',
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    ${prod.precio.toLocaleString('es-MX')} MXN
                  </span>
                </div>
                <button
                  onClick={() => iniciarPago(prod)}
                  disabled={cargandoPago}
                  style={{
                    width: '100%',
                    background: cargandoPago 
                      ? '#888' 
                      : 'linear-gradient(135deg, #635bff 0%, #4a42e8 100%)',
                    color: 'white',
                    padding: '0.8rem',
                    border: 'none',
                    borderRadius: '40px',
                    cursor: cargandoPago ? 'not-allowed' : 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    opacity: cargandoPago ? 0.7 : 1,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <FiShoppingCart size={16} />
                  {cargandoPago ? t.procesando : t.comprar}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
