import { useState, useEffect } from 'react';

export default function TiendaSoftware() {
  const [productos, setProductos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [modoAdmin, setModoAdmin] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [productoPago, setProductoPago] = useState(null);

  // Datos de Mercado Pago
  const datosPago = {
    clabe: '722969015385704037',
    beneficiario: 'Leonardo Daniel Montufar Ayala',
    institucion: 'Mercado Pago W',
    tipo: 'CLABE'
  };

  // Cargar productos desde localStorage
  useEffect(() => {
    const datosGuardados = localStorage.getItem('softwarePrototipica');
    if (datosGuardados) {
      try {
        setProductos(JSON.parse(datosGuardados));
      } catch {
        setProductos(productosEjemplo);
      }
    } else {
      setProductos(productosEjemplo);
      localStorage.setItem('softwarePrototipica', JSON.stringify(productosEjemplo));
    }
  }, []);

  // Productos de ejemplo
  const productosEjemplo = [
    {
      id: 1,
      nombre: 'Sistema POS Pro',
      precio: 2999,
      descripcion: 'Sistema de punto de venta para restaurantes y tiendas. Incluye control de inventario, ventas y reportes en tiempo real.',
      imagen: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Sistema+POS+Pro',
      video: '',
      categoria: 'negocios'
    },
    {
      id: 2,
      nombre: 'Gestor de Proyectos Ágil',
      precio: 1499,
      descripcion: 'Herramienta de gestión de proyectos con metodología ágil. Tableros Kanban, seguimiento de tareas y reportes de productividad.',
      imagen: 'https://placehold.co/600x400/333333/ffffff?text=Gestor+Ágil',
      video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      categoria: 'productividad'
    },
    {
      id: 3,
      nombre: 'CRM para PyMEs',
      precio: 2499,
      descripcion: 'Sistema de gestión de clientes y ventas. Administra contactos, seguimiento de oportunidades y automatización de correos.',
      imagen: 'https://placehold.co/600x400/444444/ffffff?text=CRM+PyMEs',
      video: '',
      categoria: 'negocios'
    }
  ];

  // Guardar productos en localStorage
  const guardarProductos = (nuevosProductos) => {
    setProductos(nuevosProductos);
    localStorage.setItem('softwarePrototipica', JSON.stringify(nuevosProductos));
  };

  // Añadir producto
  const agregarProducto = () => {
    const nuevo = {
      id: Date.now(),
      nombre: 'Nuevo software',
      precio: 0,
      descripcion: 'Descripción del software...',
      imagen: '',
      video: '',
      categoria: 'otro'
    };
    guardarProductos([...productos, nuevo]);
  };

  // Eliminar producto
  const eliminarProducto = (id) => {
    if (window.confirm('¿Eliminar este software de la tienda?')) {
      guardarProductos(productos.filter(p => p.id !== id));
    }
  };

  // Actualizar producto
  const actualizarProducto = (id, campo, valor) => {
    const copia = productos.map(p => {
      if (p.id === id) {
        return { ...p, [campo]: valor };
      }
      return p;
    });
    guardarProductos(copia);
  };

  // Activar modo admin (5 clics en el título)
  const handleTituloClick = () => {
    const nuevosClicks = clicks + 1;
    setClicks(nuevosClicks);
    if (nuevosClicks >= 5) {
      setModoAdmin(!modoAdmin);
      setClicks(0);
    }
    setTimeout(() => setClicks(0), 3000);
  };

  // Agregar al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.map(item => 
          item.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  // Eliminar del carrito
  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  // Calcular total
  const totalCarrito = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  // Abrir modal de pago
  const abrirPago = (producto) => {
    setProductoPago(producto);
    setMostrarPago(true);
  };

  // Cerrar modal de pago
  const cerrarPago = () => {
    setMostrarPago(false);
    setProductoPago(null);
  };

  // Copiar CLABE al portapapeles
  const copiarCLABE = () => {
    navigator.clipboard.writeText(datosPago.clabe);
    alert('✅ CLABE copiada al portapapeles');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Encabezado con título y carrito */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 
            onClick={handleTituloClick}
            style={{ 
              fontSize: '2rem', 
              fontWeight: '300',
              cursor: 'pointer',
              userSelect: 'none'
            }}
            title="Haz clic 5 veces para activar modo edición"
          >
            🛠️ MarketSoft
            {modoAdmin && (
              <span style={{
                fontSize: '0.7rem',
                backgroundColor: '#1a1a1a',
                color: 'white',
                padding: '0.2rem 0.8rem',
                borderRadius: '20px',
                marginLeft: '1rem',
                position: 'relative',
                top: '-0.3rem'
              }}>
                Admin ON
              </span>
            )}
          </h2>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>
            Herramientas digitales desarrolladas por Prototipica Estudio
          </p>
        </div>
        
        {/* Botón carrito */}
        <button
          onClick={() => setMostrarCarrito(!mostrarCarrito)}
          style={{
            background: '#1a1a1a',
            color: 'white',
            padding: '0.6rem 1.5rem',
            border: 'none',
            borderRadius: '40px',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = '#333'}
          onMouseLeave={(e) => e.target.style.background = '#1a1a1a'}
        >
          🛒 Carrito {carrito.length > 0 && `(${carrito.reduce((sum, item) => sum + item.cantidad, 0)})`}
        </button>
      </div>

      {/* Contador de clics admin */}
      {clicks > 0 && (
        <span style={{
          fontSize: '0.8rem',
          color: '#999',
          padding: '0.2rem 0.8rem',
          borderRadius: '20px',
          backgroundColor: '#f5f5f5',
          display: 'inline-block',
          marginBottom: '1rem'
        }}>
          {clicks}/5
        </span>
      )}

      {/* ===== CARRITO ===== */}
      {mostrarCarrito && (
        <div style={{
          border: '2px solid #1a1a1a',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem',
          backgroundColor: '#fafafa'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '500' }}>🛒 Tu carrito</h3>
            <button
              onClick={() => setMostrarCarrito(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#999',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Cerrar
            </button>
          </div>
          
          {carrito.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '2rem 0' }}>
              El carrito está vacío
            </p>
          ) : (
            <>
              {carrito.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.8rem 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <div>
                    <strong>{item.nombre}</strong>
                    <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                      x{item.cantidad}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontWeight: '500', marginRight: '1rem' }}>
                      ${(item.precio * item.cantidad).toLocaleString('es-MX')} MXN
                    </span>
                    <button
                      onClick={() => eliminarDelCarrito(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff4444',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '2px solid #1a1a1a'
              }}>
                <strong style={{ fontSize: '1.2rem' }}>Total:</strong>
                <strong style={{ fontSize: '1.4rem' }}>
                  ${totalCarrito.toLocaleString('es-MX')} MXN
                </strong>
              </div>
              
              <button
                onClick={() => {
                  const items = carrito.map(item => `${item.nombre} (x${item.cantidad})`).join(', ');
                  const mensaje = `Hola, quiero comprar: ${items}. Total: $${totalCarrito.toLocaleString('es-MX')} MXN`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`, '_blank');
                }}
                style={{
                  marginTop: '1rem',
                  background: '#1a1a1a',
                  color: 'white',
                  padding: '0.8rem 2rem',
                  border: 'none',
                  borderRadius: '40px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  width: '100%',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#333'}
                onMouseLeave={(e) => e.target.style.background = '#1a1a1a'}
              >
                💬 Comprar por WhatsApp
              </button>
            </>
          )}
        </div>
      )}

      {/* ===== MODAL DE PAGO ===== */}
      {mostrarPago && productoPago && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            maxWidth: '500px',
            width: '100%',
            padding: '2rem',
            maxHeight: '90vh',
            overflowY: 'auto',
            animation: 'slideUp 0.3s ease'
          }}>
            <style>{`
              @keyframes slideUp {
                from {
                  opacity: 0;
                  transform: translateY(30px) scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '500' }}>
                💳 Pagar con Mercado Pago
              </h3>
              <button
                onClick={cerrarPago}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#999'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              backgroundColor: '#f5f5f5',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '0.3rem' }}>
                {productoPago.nombre}
              </p>
              <p style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1a1a1a' }}>
                ${productoPago.precio.toLocaleString('es-MX')} MXN
              </p>
            </div>

            <div style={{
              border: '2px solid #1a1a1a',
              borderRadius: '12px',
              padding: '1.2rem',
              marginBottom: '1.5rem',
              backgroundColor: '#fafafa'
            }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.8rem', textAlign: 'center' }}>
                📋 Datos para realizar tu pago
              </h4>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>Beneficiario</div>
                <div style={{ fontSize: '1rem', fontWeight: '500' }}>
                  {datosPago.beneficiario}
                </div>
              </div>

              <div style={{ marginBottom: '0.8rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>Institución</div>
                <div style={{ fontSize: '1rem', fontWeight: '500' }}>
                  {datosPago.institucion}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>CLABE</div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  fontFamily: 'monospace',
                  background: 'white',
                  padding: '0.5rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }}>
                  <span>{datosPago.clabe}</span>
                  <button
                    onClick={copiarCLABE}
                    style={{
                      background: '#1a1a1a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.3rem 0.8rem',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      marginLeft: 'auto'
                    }}
                  >
                    📋 Copiar
                  </button>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: '#fff8e1',
              borderRadius: '8px',
              padding: '0.8rem 1rem',
              marginBottom: '1.2rem',
              fontSize: '0.85rem',
              color: '#795548'
            }}>
              ⚠️ Realiza tu transferencia a la CLABE proporcionada. Una vez confirmado el pago, recibirás tu producto por correo electrónico.
            </div>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button
                onClick={() => {
                  const mensaje = `Hola, acabo de realizar el pago por el software "${productoPago.nombre}" por $${productoPago.precio.toLocaleString('es-MX')} MXN. Mi nombre es:`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`, '_blank');
                  cerrarPago();
                }}
                style={{
                  flex: 1,
                  background: '#25d366',
                  color: 'white',
                  padding: '0.8rem',
                  border: 'none',
                  borderRadius: '40px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#20b85a'}
                onMouseLeave={(e) => e.target.style.background = '#25d366'}
              >
                💬 Notificar por WhatsApp
              </button>
              <button
                onClick={cerrarPago}
                style={{
                  flex: 1,
                  background: '#eee',
                  color: '#333',
                  padding: '0.8rem',
                  border: 'none',
                  borderRadius: '40px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#ddd'}
                onMouseLeave={(e) => e.target.style.background = '#eee'}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== EDITOR DE PRODUCTOS (MODO ADMIN) ===== */}
      {modoAdmin && (
        <div style={{
          border: '2px dashed #1a1a1a',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem',
          backgroundColor: '#fafafa'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ✏️ Editor de MarketSoft
            </h3>
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
              Cerrar
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {productos.map((prod, index) => (
              <div key={prod.id} style={{
                border: '1px solid #eee',
                borderRadius: '12px',
                padding: '1rem',
                backgroundColor: 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#999' }}>Producto #{index + 1}</span>
                  <button 
                    onClick={() => eliminarProducto(prod.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ff4444',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
                
                <label style={{ fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.2rem' }}>Nombre</label>
                <input 
                  type="text" 
                  value={prod.nombre} 
                  onChange={(e) => actualizarProducto(prod.id, 'nombre', e.target.value)}
                  style={{ marginBottom: '0.8rem' }}
                />
                
                <label style={{ fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.2rem' }}>Precio (MXN)</label>
                <input 
                  type="number" 
                  value={prod.precio} 
                  onChange={(e) => actualizarProducto(prod.id, 'precio', parseFloat(e.target.value))}
                  style={{ marginBottom: '0.8rem' }}
                />
                
                <label style={{ fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.2rem' }}>Descripción</label>
                <textarea 
                  value={prod.descripcion} 
                  onChange={(e) => actualizarProducto(prod.id, 'descripcion', e.target.value)}
                  style={{ marginBottom: '0.8rem', minHeight: '60px' }}
                />
                
                <label style={{ fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.2rem' }}>URL de imagen</label>
                <input 
                  type="text" 
                  value={prod.imagen} 
                  onChange={(e) => actualizarProducto(prod.id, 'imagen', e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  style={{ marginBottom: '0.8rem' }}
                />
                
                <label style={{ fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.2rem' }}>URL de video (YouTube embed)</label>
                <input 
                  type="text" 
                  value={prod.video} 
                  onChange={(e) => actualizarProducto(prod.id, 'video', e.target.value)}
                  placeholder="https://www.youtube.com/embed/VIDEO_ID"
                />
              </div>
            ))}
          </div>
          
          <button 
            onClick={agregarProducto}
            style={{
              marginTop: '1.5rem',
              background: '#1a1a1a',
              color: 'white',
              padding: '0.8rem 1.5rem',
              border: 'none',
              borderRadius: '40px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '1rem',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#333'}
            onMouseLeave={(e) => e.target.style.background = '#1a1a1a'}
          >
            + Agregar software
          </button>
        </div>
      )}

      {/* ===== GRID DE PRODUCTOS ===== */}
      {productos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: '#999'
        }}>
          <p style={{ fontSize: '1.2rem' }}>📦 No hay productos disponibles</p>
          <p style={{ fontSize: '0.9rem' }}>Activa el modo admin para agregar software</p>
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
              backgroundColor: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              {/* Imagen */}
              {prod.imagen && (
                <img 
                  src={prod.imagen} 
                  alt={prod.nombre}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              
              {/* Video */}
              {prod.video && (
                <div style={{
                  position: 'relative',
                  paddingBottom: '56.25%',
                  height: 0
                }}>
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
              
              {/* Contenido */}
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem',
                  color: '#1a1a1a'
                }}>
                  {prod.nombre}
                </h3>
                
                <p style={{
                  color: '#666',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  marginBottom: '1rem',
                  minHeight: '50px'
                }}>
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
                    fontWeight: '600',
                    color: '#1a1a1a'
                  }}>
                    ${prod.precio.toLocaleString('es-MX')} MXN
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                  <button
                    onClick={() => agregarAlCarrito(prod)}
                    style={{
                      width: '100%',
                      background: '#1a1a1a',
                      color: 'white',
                      padding: '0.8rem',
                      border: 'none',
                      borderRadius: '40px',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#333'}
                    onMouseLeave={(e) => e.target.style.background = '#1a1a1a'}
                  >
                    🛒 Agregar al carrito
                  </button>
                  <button
                    onClick={() => abrirPago(prod)}
                    style={{
                      width: '100%',
                      background: '#009ee3',
                      color: 'white',
                      padding: '0.8rem',
                      border: 'none',
                      borderRadius: '40px',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#0080c0'}
                    onMouseLeave={(e) => e.target.style.background = '#009ee3'}
                  >
                    💳 Comprar ahora
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}