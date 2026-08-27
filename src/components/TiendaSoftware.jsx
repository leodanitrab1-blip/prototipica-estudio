import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Tu clave pública de Stripe
const STRIPE_PUBLIC_KEY = 'pk_live_51U92vNBaY3CV3QUxUdcDY3Flu9HKKwX5qPtlrk3v3aJE2Ocm4HoEhRfCXKjvWu4XVIys1nzZhcdAivgg0OaQYhim00AIhSEiky';

export default function TiendaSoftware() {
  const [productos, setProductos] = useState([]);
  const [modoAdmin, setModoAdmin] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [cargandoPago, setCargandoPago] = useState(false);

  useEffect(() => {
    const datos = localStorage.getItem('softwarePrototipica');
    if (datos) {
      try {
        setProductos(JSON.parse(datos));
      } catch {
        setProductos([]);
      }
    } else {
      setProductos([]);
    }
  }, []);

  const guardarProductos = (nuevos) => {
    setProductos(nuevos);
    localStorage.setItem('softwarePrototipica', JSON.stringify(nuevos));
  };

  const agregarProducto = () => {
    const nuevo = {
      id: Date.now(),
      nombre: 'Nuevo software',
      precio: 0,
      descripcion: 'Descripción del software...',
      imagen: '',
      video: ''
    };
    guardarProductos([...productos, nuevo]);
  };

  const eliminarProducto = (id) => {
    if (window.confirm('¿Eliminar este software?')) {
      guardarProductos(productos.filter(p => p.id !== id));
    }
  };

  const actualizarProducto = (id, campo, valor) => {
    const copia = productos.map(p => {
      if (p.id === id) return { ...p, [campo]: valor };
      return p;
    });
    guardarProductos(copia);
  };

  const handleTituloClick = () => {
    const nuevos = clicks + 1;
    setClicks(nuevos);
    if (nuevos >= 5) {
      setModoAdmin(!modoAdmin);
      setClicks(0);
    }
    setTimeout(() => setClicks(0), 3000);
  };

  // Función para manejar el pago con Stripe
  const manejarPago = async (producto) => {
    setCargandoPago(true);
    
    try {
      const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
      
      const response = await fetch('/api/crear-sesion-pago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productoId: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          descripcion: producto.descripcion
        })
      });

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (result.error) {
        alert('Error al procesar el pago: ' + result.error.message);
      }
    } catch (error) {
      alert('Error al conectar con Stripe. Intenta nuevamente.');
      console.error('Error:', error);
    } finally {
      setCargandoPago(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 
          onClick={handleTituloClick}
          style={{ 
            fontSize: '2rem', 
            fontWeight: '300',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
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
      </div>

      {clicks > 0 && <span style={{ fontSize: '0.8rem', color: '#999' }}>{clicks}/5</span>}

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
            <button onClick={() => setModoAdmin(false)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}>Cerrar</button>
          </div>
          
          {productos.map((prod) => (
            <div key={prod.id} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', background: 'white', borderRadius: '8px' }}>
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
              <button onClick={() => eliminarProducto(prod.id)} style={{ background: '#ff4444', color: 'white', border: 'none', padding: '0.3rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                Eliminar
              </button>
            </div>
          ))}
          
          <button onClick={agregarProducto} style={{
            background: '#1a1a1a',
            color: 'white',
            padding: '0.8rem',
            border: 'none',
            borderRadius: '8px',
            width: '100%',
            cursor: 'pointer'
          }}>
            + Agregar producto
          </button>
        </div>
      )}

      {productos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
          <p>📦 No hay productos disponibles</p>
          <p style={{ fontSize: '0.9rem' }}>Haz clic 5 veces en "MarketSoft" para agregar</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {productos.map(prod => (
            <div key={prod.id} style={{
              border: '1px solid #eee',
              borderRadius: '16px',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              background: 'white'
            }}>
              {prod.imagen && (
                <img src={prod.imagen} alt={prod.nombre} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              )}
              {prod.video && (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                  <iframe src={prod.video} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen title={prod.nombre} />
                </div>
              )}
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '0.5rem' }}>{prod.nombre}</h3>
                <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '1rem' }}>{prod.descripcion}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: '600' }}>${prod.precio.toLocaleString('es-MX')} MXN</span>
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
                    transition: 'all 0.2s ease',
                    opacity: cargandoPago ? 0.7 : 1
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