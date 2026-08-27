import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = 'pk_live_51U92vNBaY3CV3QUxUdcDY3Flu9HKKwX5qPtlrk3v3aJE2Ocm4HoEhRfCXKjvWu4XVIys1nzZhcdAivgg0OaQYhim00AIhSEiky';

export default function TiendaSoftware() {
  const [productos, setProductos] = useState([]);
  const [modoAdmin, setModoAdmin] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [cargandoPago, setCargandoPago] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const ADMIN_PASSWORD = 'prototipica2026';

  // Cargar productos desde el backend
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      setError('');
      console.log('📦 Cargando productos...');
      const response = await fetch('/api/productos');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Productos cargados:', data.length);
        setProductos(data);
      } else {
        const errorData = await response.json();
        console.error('❌ Error al cargar productos:', errorData);
        setError('Error al cargar productos: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setCargando(false);
    }
  };

  const agregarProducto = async () => {
    console.log('➕ Intentando agregar producto...');
    
    const nuevo = {
      nombre: 'Nuevo software',
      precio: 0,
      descripcion: 'Descripción del software...',
      imagen: '',
      video: ''
    };

    try {
      setError('');
      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo)
      });
      
      console.log('📡 Respuesta del servidor:', response.status);
      
      if (response.ok) {
        const producto = await response.json();
        console.log('✅ Producto agregado:', producto);
        setProductos([...productos, producto]);
      } else {
        const errorData = await response.json();
        console.error('❌ Error del servidor:', errorData);
        setError('Error al agregar: ' + (errorData.error || 'Error desconocido'));
        alert('Error al agregar producto: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      setError('Error de conexión con el servidor');
      alert('Error de conexión. Revisa tu internet.');
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Eliminar este software?')) return;

    try {
      const response = await fetch(`/api/productos/${id}`, {
        method: 'DELETE'
      });
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
      setErrorPassword('❌ Contraseña incorrecta');
    }
  };

  const manejarPago = async (producto) => {
    setCargandoPago(true);
    try {
      const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
      
      const response = await fetch('/api/crear-sesion-pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: producto.nombre,
          precio: producto.precio,
          descripcion: producto.descripcion
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
      console.error('Error en pago:', error);
      alert('Error al conectar con Stripe: ' + error.message);
    } finally {
      setCargandoPago(false);
    }
  };

  if (cargando) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 onClick={handleTituloClick} style={{ fontSize: '2rem', fontWeight: '300', cursor: 'pointer', userSelect: 'none' }}>
          🛠️ MarketSoft
          {modoAdmin && (
            <span style={{
              fontSize: '0.7rem',
              background: '#1a1a1a',
              color: 'white',
              padding: '0.2rem 0.8rem',
              borderRadius: '20px',
              marginLeft: '1rem'
            }}>
              Admin
            </span>
          )}
        </h2>
        <span style={{ color: '#999', fontSize: '0.85rem' }}>
          {productos.length} productos
        </span>
      </div>

      {error && (
        <div style={{
          background: '#fff0f0',
          border: '1px solid #ffcdd2',
          borderRadius: '8px',
          padding: '0.8rem 1.2rem',
          color: '#c62828',
          marginBottom: '1rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      {mostrarLogin && !modoAdmin && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
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
            borderRadius: '16px',
            maxWidth: '400px',
            width: '100%',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>🔒 Acceso de administrador</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Ingresa la contraseña para administrar los productos.
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña..."
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                marginBottom: '0.8rem',
                fontSize: '1rem'
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
                  background: '#1a1a1a',
                  color: 'white',
                  padding: '0.8rem',
                  border: 'none',
                  borderRadius: '40px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Ingresar
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
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {modoAdmin && (
        <div style={{
          border: '2px dashed #1a1a1a',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          background: '#fafafa'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3>✏️ Editor de Productos</h3>
            <button
              onClick={() => setModoAdmin(false)}
              style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}
            >
              Cerrar
            </button>
          </div>

          {productos.map((prod) => (
            <div key={prod.id} style={{
              border: '1px solid #eee',
              padding: '1rem',
              marginBottom: '1rem',
              background: 'white',
              borderRadius: '8px'
            }}>
              <input
                value={prod.nombre}
                onChange={(e) => actualizarProducto(prod.id, 'nombre', e.target.value)}
                placeholder="Nombre del software"
                style={{ marginBottom: '0.5rem' }}
              />
              <input
                type="number"
                value={prod.precio}
                onChange={(e) => actualizarProducto(prod.id, 'precio', parseFloat(e.target.value))}
                placeholder="Precio en MXN"
                style={{ marginBottom: '0.5rem' }}
              />
              <textarea
                value={prod.descripcion}
                onChange={(e) => actualizarProducto(prod.id, 'descripcion', e.target.value)}
                placeholder="Descripción del software"
                rows="2"
                style={{ marginBottom: '0.5rem' }}
              />
              <input
                value={prod.imagen}
                onChange={(e) => actualizarProducto(prod.id, 'imagen', e.target.value)}
                placeholder="URL de imagen"
                style={{ marginBottom: '0.5rem' }}
              />
              <input
                value={prod.video}
                onChange={(e) => actualizarProducto(prod.id, 'video', e.target.value)}
                placeholder="URL de video (YouTube embed)"
                style={{ marginBottom: '0.5rem' }}
              />
              <button
                onClick={() => eliminarProducto(prod.id)}
                style={{
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  padding: '0.3rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Eliminar
              </button>
            </div>
          ))}

          <button
            onClick={agregarProducto}
            style={{
              background: '#1a1a1a',
              color: 'white',
              padding: '0.8rem',
              border: 'none',
              borderRadius: '8px',
              width: '100%',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#333'}
            onMouseLeave={(e) => e.target.style.background = '#1a1a1a'}
          >
            + Agregar producto
          </button>
        </div>
      )}

      {productos.length === 0 && !modoAdmin && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
          <p>📦 No hay productos disponibles</p>
          <p style={{ fontSize: '0.9rem' }}>
            Haz clic en "MarketSoft" para acceder al panel de administración
          </p>
        </div>
      )}

      {productos.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {productos.map((prod) => (
            <div
              key={prod.id}
              style={{
                border: '1px solid #eee',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                background: 'white'
              }}
            >
              {prod.imagen && (
                <img
                  src={prod.imagen}
                  alt={prod.nombre}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              {prod.video && (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                  <iframe
                    src={prod.video}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    allowFullScreen
                    title={prod.nombre}
                  />
                </div>
              )}
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  {prod.nombre}
                </h3>
                <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '1rem' }}>
                  {prod.descripcion}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                    ${prod.precio.toLocaleString('es-MX')} MXN
                  </span>
                </div>
                <button
                  onClick={() => manejarPago(prod)}
                  disabled={cargandoPago}
                  style={{
                    width: '100%',
                    background: '#635bff',
                    color: 'white',
                    padding: '0.8rem',
                    border: 'none',
                    borderRadius: '40px',
                    cursor: cargandoPago ? 'not-allowed' : 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    opacity: cargandoPago ? 0.7 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cargandoPago ? '⏳ Procesando...' : '💳 Comprar con Stripe'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}