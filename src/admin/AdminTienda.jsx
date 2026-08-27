import { useState, useEffect } from 'react';

export default function AdminTienda() {
  const [productos, setProductos] = useState([]);
  const [modoAdmin, setModoAdmin] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todos');

  // Cargar productos desde localStorage
  useEffect(() => {
    const datosGuardados = localStorage.getItem('softwarePrototipica');
    if (datosGuardados) {
      try {
        setProductos(JSON.parse(datosGuardados));
      } catch {
        setProductos([]);
      }
    } else {
      setProductos([]);
    }
  }, []);

  // Guardar productos en localStorage
  const guardarProductos = (nuevosProductos) => {
    setProductos(nuevosProductos);
    localStorage.setItem('softwarePrototipica', JSON.stringify(nuevosProductos));
    setMensaje('✅ Cambios guardados correctamente');
    setTimeout(() => setMensaje(''), 3000);
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
      categoria: 'otro',
      fecha: new Date().toLocaleDateString('es-MX')
    };
    guardarProductos([...productos, nuevo]);
  };

  // Eliminar producto
  const eliminarProducto = (id) => {
    if (window.confirm('¿Eliminar este software de la tienda permanentemente?')) {
      guardarProductos(productos.filter(p => p.id !== id));
    }
  };

  // Actualizar campo
  const actualizarProducto = (id, campo, valor) => {
    const copia = productos.map(p => {
      if (p.id === id) {
        return { ...p, [campo]: valor };
      }
      return p;
    });
    guardarProductos(copia);
  };

  // Activar modo admin
  const handleTituloClick = () => {
    const nuevosClicks = clicks + 1;
    setClicks(nuevosClicks);
    if (nuevosClicks >= 5) {
      setModoAdmin(!modoAdmin);
      setClicks(0);
    }
    setTimeout(() => setClicks(0), 3000);
  };

  // Categorías disponibles
  const categorias = [
    { value: 'todos', label: 'Todos' },
    { value: 'negocios', label: '💼 Negocios' },
    { value: 'productividad', label: '📊 Productividad' },
    { value: 'educacion', label: '📚 Educación' },
    { value: 'diseno', label: '🎨 Diseño' },
    { value: 'otro', label: '📦 Otro' }
  ];

  // Filtrar productos
  const productosFiltrados = categoriaFiltro === 'todos' 
    ? productos 
    : productos.filter(p => p.categoria === categoriaFiltro);

  // Calcular estadísticas
  const totalProductos = productos.length;
  const totalValor = productos.reduce((sum, p) => sum + p.precio, 0);
  const promedioPrecio = totalProductos > 0 ? totalValor / totalProductos : 0;

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      
      {/* Título con activación admin */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <h2 
          onClick={handleTituloClick}
          style={{ 
            fontSize: '1.8rem', 
            fontWeight: '300',
            cursor: 'pointer',
            userSelect: 'none'
          }}
          title="Haz clic 5 veces para activar modo administración"
        >
          🛒 Panel de Administración - MarketSoft
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
        
        {clicks > 0 && (
          <span style={{
            fontSize: '0.8rem',
            color: '#999',
            padding: '0.2rem 0.8rem',
            borderRadius: '20px',
            backgroundColor: '#f5f5f5'
          }}>
            {clicks}/5
          </span>
        )}
      </div>

      {/* Mensaje de estado */}
      {mensaje && (
        <div style={{
          backgroundColor: '#f0f7f0',
          border: '1px solid #c8e6c9',
          borderRadius: '8px',
          padding: '0.8rem 1.2rem',
          marginBottom: '1.5rem',
          color: '#2e7d32'
        }}>
          {mensaje}
        </div>
      )}

      {/* Panel de administración (solo visible en modo admin) */}
      {modoAdmin ? (
        <>
          {/* Estadísticas rápidas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid #eee',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1a1a1a' }}>
                {totalProductos}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#999' }}>Productos</div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid #eee',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1a1a1a' }}>
                ${totalValor.toLocaleString('es-MX')}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#999' }}>Valor total</div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid #eee',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1a1a1a' }}>
                ${promedioPrecio.toFixed(0).toLocaleString('es-MX')}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#999' }}>Precio promedio</div>
            </div>
          </div>

          {/* Filtro y botón agregar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '0.8rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#666' }}>Filtrar:</label>
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                style={{
                  padding: '0.4rem 1rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                {categorias.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={agregarProducto}
              style={{
                background: '#1a1a1a',
                color: 'white',
                padding: '0.6rem 1.5rem',
                border: 'none',
                borderRadius: '40px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#333'}
              onMouseLeave={(e) => e.target.style.background = '#1a1a1a'}
            >
              + Agregar producto
            </button>
          </div>

          {/* Lista de productos editable */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {productosFiltrados.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                border: '2px dashed #ddd',
                borderRadius: '12px',
                color: '#999'
              }}>
                <p style={{ fontSize: '1.2rem' }}>📦 No hay productos en esta categoría</p>
                <p style={{ fontSize: '0.9rem' }}>Agrega tu primer producto o cambia el filtro</p>
              </div>
            ) : (
              productosFiltrados.map((prod, index) => (
                <div key={prod.id} style={{
                  border: '1px solid #eee',
                  borderRadius: '12px',
                  padding: '1.2rem',
                  backgroundColor: 'white',
                  transition: 'box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.8rem',
                    flexWrap: 'wrap',
                    gap: '0.3rem'
                  }}>
                    <span style={{ fontSize: '0.8rem', color: '#999' }}>
                      #{index + 1} · {prod.fecha || 'Sin fecha'}
                    </span>
                    <button
                      onClick={() => eliminarProducto(prod.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff4444',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#fff0f0'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '500', color: '#666', display: 'block', marginBottom: '0.2rem' }}>
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={prod.nombre}
                        onChange={(e) => actualizarProducto(prod.id, 'nombre', e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '500', color: '#666', display: 'block', marginBottom: '0.2rem' }}>
                        Precio (MXN)
                      </label>
                      <input
                        type="number"
                        value={prod.precio}
                        onChange={(e) => actualizarProducto(prod.id, 'precio', parseFloat(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '0.8rem', marginTop: '0.8rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '500', color: '#666', display: 'block', marginBottom: '0.2rem' }}>
                      Descripción
                    </label>
                    <textarea
                      value={prod.descripcion}
                      onChange={(e) => actualizarProducto(prod.id, 'descripcion', e.target.value)}
                      rows="2"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '500', color: '#666', display: 'block', marginBottom: '0.2rem' }}>
                        Categoría
                      </label>
                      <select
                        value={prod.categoria || 'otro'}
                        onChange={(e) => actualizarProducto(prod.id, 'categoria', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.7rem 1rem',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '0.95rem',
                          backgroundColor: 'white'
                        }}
                      >
                        {categorias.filter(c => c.value !== 'todos').map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '500', color: '#666', display: 'block', marginBottom: '0.2rem' }}>
                        URL de imagen
                      </label>
                      <input
                        type="text"
                        value={prod.imagen}
                        onChange={(e) => actualizarProducto(prod.id, 'imagen', e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '0.8rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '500', color: '#666', display: 'block', marginBottom: '0.2rem' }}>
                      URL de video (YouTube embed)
                    </label>
                    <input
                      type="text"
                      value={prod.video}
                      onChange={(e) => actualizarProducto(prod.id, 'video', e.target.value)}
                      placeholder="https://www.youtube.com/embed/VIDEO_ID"
                    />
                  </div>

                  {/* Vista previa de imagen */}
                  {prod.imagen && (
                    <div style={{ marginTop: '0.8rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#999' }}>Vista previa:</span>
                      <img 
                        src={prod.imagen} 
                        alt={prod.nombre}
                        style={{
                          maxHeight: '100px',
                          maxWidth: '100%',
                          borderRadius: '8px',
                          marginTop: '0.3rem',
                          border: '1px solid #eee'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#666'
          }}>
            💡 Los cambios se guardan automáticamente en tu navegador
          </div>

          <button
            onClick={() => setModoAdmin(false)}
            style={{
              marginTop: '1.5rem',
              background: 'transparent',
              border: '2px solid #1a1a1a',
              color: '#1a1a1a',
              padding: '0.7rem 2rem',
              borderRadius: '40px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#1a1a1a';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#1a1a1a';
            }}
          >
            Cerrar administración
          </button>
        </>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          border: '2px dashed #eee',
          borderRadius: '16px',
          backgroundColor: '#fafafa'
        }}>
          <p style={{ fontSize: '1.2rem', color: '#999', marginBottom: '0.5rem' }}>
            🔒 Modo administración desactivado
          </p>
          <p style={{ fontSize: '0.9rem', color: '#bbb' }}>
            Haz clic 5 veces en el título "Panel de Administración - MarketSoft" para activarlo
          </p>
        </div>
      )}
    </div>
  );
}