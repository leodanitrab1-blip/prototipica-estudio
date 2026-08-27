import { useState, useEffect } from 'react';

export default function SeccionCentral() {
  const [noticias, setNoticias] = useState([]);
  const [editando, setEditando] = useState(false);
  const [modoAdmin, setModoAdmin] = useState(false);
  const [clicks, setClicks] = useState(0);

  // Cargar noticias desde localStorage al iniciar
  useEffect(() => {
    const datosGuardados = localStorage.getItem('noticiasPrototipica');
    if (datosGuardados) {
      try {
        setNoticias(JSON.parse(datosGuardados));
      } catch {
        setNoticias(noticiasEjemplo);
      }
    } else {
      setNoticias(noticiasEjemplo);
      localStorage.setItem('noticiasPrototipica', JSON.stringify(noticiasEjemplo));
    }
  }, []);

  // Noticias de ejemplo
  const noticiasEjemplo = [
    {
      id: 1,
      titulo: '🚀 Bienvenidos a Prototipica Estudio',
      contenido: 'Somos un estudio de programación especializado en soluciones digitales a medida. Este es nuestro nuevo sitio web donde podrás conocer nuestros proyectos, adquirir herramientas y cotizar tus ideas.',
      imagen: 'https://placehold.co/800x400/1a1a1a/ffffff?text=Prototipica+Estudio',
      video: ''
    },
    {
      id: 2,
      titulo: '📱 Nueva App de Gestión Empresarial',
      contenido: 'Estamos desarrollando una aplicación móvil para control de inventarios y ventas en tiempo real. Próximamente disponible para iOS y Android.',
      imagen: 'https://placehold.co/800x400/333333/ffffff?text=App+Gestión+Empresarial',
      video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];

  // Guardar noticias en localStorage
  const guardarNoticias = (nuevasNoticias) => {
    setNoticias(nuevasNoticias);
    localStorage.setItem('noticiasPrototipica', JSON.stringify(nuevasNoticias));
  };

  // Añadir nueva noticia
  const agregarNoticia = () => {
    const nueva = {
      id: Date.now(),
      titulo: 'Nueva noticia',
      contenido: 'Descripción de la noticia...',
      imagen: '',
      video: ''
    };
    guardarNoticias([...noticias, nueva]);
  };

  // Eliminar noticia
  const eliminarNoticia = (id) => {
    if (window.confirm('¿Eliminar esta noticia?')) {
      guardarNoticias(noticias.filter(n => n.id !== id));
    }
  };

  // Actualizar campo de una noticia
  const actualizarNoticia = (id, campo, valor) => {
    const copia = noticias.map(n => {
      if (n.id === id) {
        return { ...n, [campo]: valor };
      }
      return n;
    });
    guardarNoticias(copia);
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

  return (
    <section id="inicio" style={{ paddingTop: '1rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Título con doble función: normal y activar admin */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 
            onClick={handleTituloClick}
            style={{ 
              fontSize: '2rem', 
              fontWeight: '300',
              cursor: 'pointer',
              userSelect: 'none',
              position: 'relative'
            }}
            title="Haz clic 5 veces para activar modo edición"
          >
            📰 Noticias y Proyectos
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
          
          {/* Contador de clics (solo visible para el admin) */}
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

        {/* ===== EDITOR DE NOTICIAS (MODO ADMIN) ===== */}
        {modoAdmin && (
          <div style={{
            border: '2px dashed #1a1a1a',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem',
            backgroundColor: '#fafafa'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ✏️ Editor de Noticias
              <button 
                onClick={() => setModoAdmin(false)}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Cerrar
              </button>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {noticias.map((nota, index) => (
                <div key={nota.id} style={{
                  border: '1px solid #eee',
                  borderRadius: '12px',
                  padding: '1rem',
                  backgroundColor: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#999' }}>Noticia #{index + 1}</span>
                    <button 
                      onClick={() => eliminarNoticia(nota.id)}
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
                  
                  <label style={{ fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.2rem' }}>Título</label>
                  <input 
                    type="text" 
                    value={nota.titulo} 
                    onChange={(e) => actualizarNoticia(nota.id, 'titulo', e.target.value)}
                    style={{ marginBottom: '0.8rem' }}
                  />
                  
                  <label style={{ fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.2rem' }}>Contenido</label>
                  <textarea 
                    value={nota.contenido} 
                    onChange={(e) => actualizarNoticia(nota.id, 'contenido', e.target.value)}
                    style={{ marginBottom: '0.8rem', minHeight: '60px' }}
                  />
                  
                  <label style={{ fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.2rem' }}>URL de imagen</label>
                  <input 
                    type="text" 
                    value={nota.imagen} 
                    onChange={(e) => actualizarNoticia(nota.id, 'imagen', e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    style={{ marginBottom: '0.8rem' }}
                  />
                  
                  <label style={{ fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.2rem' }}>URL de video (YouTube embed)</label>
                  <input 
                    type="text" 
                    value={nota.video} 
                    onChange={(e) => actualizarNoticia(nota.id, 'video', e.target.value)}
                    placeholder="https://www.youtube.com/embed/VIDEO_ID"
                  />
                </div>
              ))}
            </div>
            
            <button 
              onClick={agregarNoticia}
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
              + Agregar noticia
            </button>
          </div>
        )}

        {/* ===== RENDERIZADO DE NOTICIAS ===== */}
        {noticias.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: '#999'
          }}>
            <p style={{ fontSize: '1.2rem' }}>📭 No hay noticias aún</p>
            <p style={{ fontSize: '0.9rem' }}>Activa el modo admin para agregar contenido</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {noticias.map(nota => (
              <article key={nota.id} style={{
                borderBottom: '1px solid #eee',
                paddingBottom: '2rem'
              }}>
                {/* Imagen */}
                {nota.imagen && (
                  <img 
                    src={nota.imagen} 
                    alt={nota.titulo} 
                    style={{
                      width: '100%',
                      maxHeight: '400px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      marginBottom: '1rem'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                
                {/* Video */}
                {nota.video && (
                  <div style={{
                    position: 'relative',
                    paddingBottom: '56.25%',
                    height: 0,
                    marginBottom: '1rem',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}>
                    <iframe
                      src={nota.video}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none'
                      }}
                      allowFullScreen
                      title={nota.titulo}
                    />
                  </div>
                )}
                
                {/* Título y contenido */}
                <h3 style={{ fontSize: '1.6rem', fontWeight: '400', marginBottom: '0.5rem' }}>
                  {nota.titulo}
                </h3>
                <p style={{ color: '#444', lineHeight: '1.8' }}>
                  {nota.contenido}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}