import { useState, useEffect } from 'react';

export default function AdminCentral() {
  const [noticias, setNoticias] = useState([]);
  const [modoAdmin, setModoAdmin] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [mensaje, setMensaje] = useState('');

  // Cargar noticias desde localStorage
  useEffect(() => {
    const datosGuardados = localStorage.getItem('noticiasPrototipica');
    if (datosGuardados) {
      try {
        setNoticias(JSON.parse(datosGuardados));
      } catch {
        setNoticias([]);
      }
    } else {
      setNoticias([]);
    }
  }, []);

  // Guardar noticias en localStorage
  const guardarNoticias = (nuevasNoticias) => {
    setNoticias(nuevasNoticias);
    localStorage.setItem('noticiasPrototipica', JSON.stringify(nuevasNoticias));
    setMensaje('✅ Cambios guardados correctamente');
    setTimeout(() => setMensaje(''), 3000);
  };

  // Añadir noticia
  const agregarNoticia = () => {
    const nueva = {
      id: Date.now(),
      titulo: 'Nueva noticia',
      contenido: 'Descripción de la noticia...',
      imagen: '',
      video: '',
      fecha: new Date().toLocaleDateString('es-MX')
    };
    guardarNoticias([...noticias, nueva]);
  };

  // Eliminar noticia
  const eliminarNoticia = (id) => {
    if (window.confirm('¿Eliminar esta noticia permanentemente?')) {
      guardarNoticias(noticias.filter(n => n.id !== id));
    }
  };

  // Actualizar campo
  const actualizarNoticia = (id, campo, valor) => {
    const copia = noticias.map(n => {
      if (n.id === id) {
        return { ...n, [campo]: valor };
      }
      return n;
    });
    guardarNoticias(copia);
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

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      
      {/* Título con activación admin */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem'
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
          📰 Panel de Administración - Noticias
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
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>
              {noticias.length} noticias publicadas
            </span>
            <button
              onClick={agregarNoticia}
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
              + Agregar noticia
            </button>
          </div>

          {/* Lista de noticias editable */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {noticias.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                border: '2px dashed #ddd',
                borderRadius: '12px',
                color: '#999'
              }}>
                <p style={{ fontSize: '1.2rem' }}>📭 No hay noticias</p>
                <p style={{ fontSize: '0.9rem' }}>Comienza agregando tu primera noticia</p>
              </div>
            ) : (
              noticias.map((nota, index) => (
                <div key={nota.id} style={{
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
                    marginBottom: '0.8rem'
                  }}>
                    <span style={{ fontSize: '0.8rem', color: '#999' }}>
                      #{index + 1} · {nota.fecha || 'Sin fecha'}
                    </span>
                    <button
                      onClick={() => eliminarNoticia(nota.id)}
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

                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '500', color: '#666', display: 'block', marginBottom: '0.2rem' }}>
                      Título
                    </label>
                    <input
                      type="text"
                      value={nota.titulo}
                      onChange={(e) => actualizarNoticia(nota.id, 'titulo', e.target.value)}
                      style={{ marginBottom: '0' }}
                    />
                  </div>

                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '500', color: '#666', display: 'block', marginBottom: '0.2rem' }}>
                      Contenido
                    </label>
                    <textarea
                      value={nota.contenido}
                      onChange={(e) => actualizarNoticia(nota.id, 'contenido', e.target.value)}
                      rows="3"
                      style={{ marginBottom: '0' }}
                    />
                  </div>

                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '500', color: '#666', display: 'block', marginBottom: '0.2rem' }}>
                      URL de imagen
                    </label>
                    <input
                      type="text"
                      value={nota.imagen}
                      onChange={(e) => actualizarNoticia(nota.id, 'imagen', e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '500', color: '#666', display: 'block', marginBottom: '0.2rem' }}>
                      URL de video (YouTube embed)
                    </label>
                    <input
                      type="text"
                      value={nota.video}
                      onChange={(e) => actualizarNoticia(nota.id, 'video', e.target.value)}
                      placeholder="https://www.youtube.com/embed/VIDEO_ID"
                    />
                  </div>
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
            Haz clic 5 veces en el título "Panel de Administración" para activarlo
          </p>
        </div>
      )}
    </div>
  );
}