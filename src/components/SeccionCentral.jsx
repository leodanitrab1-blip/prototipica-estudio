import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiX, FiLock, FiEdit3 } from 'react-icons/fi';

const SUPABASE_URL = 'https://mcqpnkjnktzmaxkqwafc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ECwaAPhBKcLaNJGiS08h0A_n29A0h8M';

export default function SeccionCentral({ cambiarPagina, idioma }) {
  const [noticias, setNoticias] = useState([]);
  const [modoAdmin, setModoAdmin] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [cargando, setCargando] = useState(true);
  const ADMIN_PASSWORD = 'prototipica2026';

  const textos = {
    es: {
      noticias: 'Noticias',
      admin: 'Admin',
      accesoAdmin: 'Acceso de administrador',
      ingresaPassword: 'Ingresa la contraseña para administrar las noticias.',
      contraseña: 'Contraseña...',
      ingresar: 'Ingresar',
      cancelar: 'Cancelar',
      editorNoticias: 'Editor de Noticias',
      cerrar: 'Cerrar',
      agregarNoticia: 'Agregar noticia',
      eliminar: 'Eliminar',
      titulo: 'Título',
      contenido: 'Contenido',
      imagen: 'URL de imagen',
      video: 'URL de video (YouTube)',
      noHayNoticias: 'No hay noticias',
      hazClic: 'Haz clic en "Noticias" para acceder al panel',
      eliminarConfirm: '¿Eliminar esta noticia?',
      errorPassword: 'Contraseña incorrecta',
      bienvenido: 'Bienvenido a Prototipica Estudio',
      descripcion: 'Software y soluciones digitales para tu negocio. Innovación y calidad en cada proyecto.',
      explorar: 'Explorar productos',
      cotizar: 'Cotizar ahora',
      cargando: 'Cargando...'
    },
    en: {
      noticias: 'News',
      admin: 'Admin',
      accesoAdmin: 'Admin Access',
      ingresaPassword: 'Enter the password to manage news.',
      contraseña: 'Password...',
      ingresar: 'Login',
      cancelar: 'Cancel',
      editorNoticias: 'News Editor',
      cerrar: 'Close',
      agregarNoticia: 'Add news',
      eliminar: 'Delete',
      titulo: 'Title',
      contenido: 'Content',
      imagen: 'Image URL',
      video: 'Video URL (YouTube)',
      noHayNoticias: 'No news',
      hazClic: 'Click on "News" to access the panel',
      eliminarConfirm: 'Delete this news?',
      errorPassword: 'Incorrect password',
      bienvenido: 'Welcome to Prototipica Estudio',
      descripcion: 'Software and digital solutions for your business. Innovation and quality in every project.',
      explorar: 'Explore products',
      cotizar: 'Get a quote',
      cargando: 'Loading...'
    }
  };

  const t = textos[idioma] || textos.es;

  // Cargar noticias desde Supabase
  const cargarNoticias = async () => {
    try {
      setCargando(true);
      const response = await fetch(`${SUPABASE_URL}/rest/v1/noticias?select=*&order=fecha.desc`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNoticias(data.map(n => ({
          id: Number(n.id),
          titulo: n.titulo || '',
          contenido: n.contenido || '',
          imagen: n.imagen || '',
          video: n.video || ''
        })));
      }
    } catch (error) {
      console.error('Error al cargar noticias:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  const guardarNoticias = async (nuevas) => {
    setNoticias(nuevas);
  };

  const agregarNoticia = async () => {
    const nueva = { 
      id: Date.now(), 
      titulo: 'Nueva noticia', 
      contenido: 'Escribe aquí el contenido...', 
      imagen: '', 
      video: '' 
    };
    
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/noticias`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: nueva.id,
          titulo: nueva.titulo,
          contenido: nueva.contenido,
          imagen: nueva.imagen,
          video: nueva.video
        })
      });
      
      if (response.ok) {
        setNoticias([...noticias, nueva]);
      }
    } catch (error) {
      console.error('Error al agregar:', error);
    }
  };

  const eliminarNoticia = async (id) => {
    if (window.confirm(t.eliminarConfirm)) {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/noticias?id=eq.${id}`, {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        });
        
        if (response.ok) {
          setNoticias(noticias.filter(n => n.id !== id));
        }
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  const actualizarNoticia = async (id, campo, valor) => {
    const copia = noticias.map(n => {
      if (n.id === id) return { ...n, [campo]: valor };
      return n;
    });
    setNoticias(copia);
    
    // Actualizar en Supabase
    try {
      const body = {};
      body[campo] = valor;
      
      await fetch(`${SUPABASE_URL}/rest/v1/noticias?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
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

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        padding: '3rem 1rem 2rem',
        background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
        borderRadius: '24px',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: '700',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          position: 'relative'
        }}>
          {t.bienvenido}
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.1rem)',
          color: '#666',
          marginBottom: '2rem',
          position: 'relative'
        }}>
          {t.descripcion}
        </p>
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          position: 'relative'
        }}>
          <button
            onClick={() => cambiarPagina && cambiarPagina('tienda')}
            style={{
              padding: '0.8rem 2rem',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '40px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}
          >
            {t.explorar}
          </button>
          <button
            onClick={() => cambiarPagina && cambiarPagina('cotizar')}
            style={{
              padding: '0.8rem 2rem',
              background: 'transparent',
              color: '#1a1a1a',
              border: '2px solid #1a1a1a',
              borderRadius: '40px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            {t.cotizar}
          </button>
        </div>
      </div>

      {/* Título de noticias */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        padding: '0 0.5rem'
      }}>
        <h2 
          onClick={handleTituloClick} 
          style={{ 
            fontSize: '1.8rem', 
            fontWeight: '300', 
            cursor: 'pointer', 
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            fontFamily: "'Playfair Display', serif",
            margin: 0
          }}
        >
          📰 {t.noticias}
          {modoAdmin && (
            <span style={{ 
              fontSize: '0.7rem', 
              background: '#1a1a1a', 
              color: 'white', 
              padding: '0.2rem 0.8rem', 
              borderRadius: '20px',
              fontFamily: "'Inter', sans-serif"
            }}>
              {t.admin}
            </span>
          )}
        </h2>
      </div>

      {/* Login modal */}
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
            {errorPassword && <p style={{ color: '#c62828', fontSize: '0.9rem', marginBottom: '0.8rem' }}>{errorPassword}</p>}
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
                onClick={() => { setMostrarLogin(false); setPassword(''); setErrorPassword(''); }} 
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

      {/* Panel admin */}
      {modoAdmin && (
        <div style={{ 
          border: '2px dashed #1a1a1a', 
          borderRadius: '16px', 
          padding: '1.5rem', 
          marginBottom: '2rem', 
          background: '#fafafa'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <FiEdit3 /> {t.editorNoticias}
            </h3>
            <button 
              onClick={() => setModoAdmin(false)}
              style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}
            >
              {t.cerrar}
            </button>
          </div>
          
          {noticias.map((nota) => (
            <div key={nota.id} style={{ 
              border: '1px solid #eee', 
              padding: '1rem', 
              marginBottom: '1rem', 
              background: 'white', 
              borderRadius: '12px' 
            }}>
              <input 
                value={nota.titulo} 
                onChange={(e) => actualizarNoticia(nota.id, 'titulo', e.target.value)} 
                placeholder={t.titulo} 
                style={{ marginBottom: '0.5rem', width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '8px' }}
              />
              <textarea 
                value={nota.contenido} 
                onChange={(e) => actualizarNoticia(nota.id, 'contenido', e.target.value)} 
                placeholder={t.contenido} 
                rows="2" 
                style={{ marginBottom: '0.5rem', width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '8px' }}
              />
              <input 
                value={nota.imagen} 
                onChange={(e) => actualizarNoticia(nota.id, 'imagen', e.target.value)} 
                placeholder={t.imagen} 
                style={{ marginBottom: '0.5rem', width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '8px' }}
              />
              <input 
                value={nota.video} 
                onChange={(e) => actualizarNoticia(nota.id, 'video', e.target.value)} 
                placeholder={t.video} 
                style={{ marginBottom: '0.5rem', width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '8px' }}
              />
              <button 
                onClick={() => eliminarNoticia(nota.id)} 
                style={{ 
                  background: '#ff4444', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <FiTrash2 size={14} /> {t.eliminar}
              </button>
            </div>
          ))}
          
          <button 
            onClick={agregarNoticia} 
            style={{ 
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', 
              color: 'white', 
              padding: '0.8rem', 
              border: 'none', 
              borderRadius: '12px', 
              width: '100%', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: '600'
            }}
          >
            <FiPlus /> {t.agregarNoticia}
          </button>
        </div>
      )}

      {/* Noticias vacías */}
      {noticias.length === 0 && !modoAdmin && !cargando && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: '#999',
          background: '#fafafa',
          borderRadius: '16px'
        }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>📭 {t.noHayNoticias}</p>
          <p style={{ fontSize: '0.9rem' }}>{t.hazClic}</p>
        </div>
      )}

      {/* Cargando */}
      {cargando && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          {t.cargando}
        </div>
      )}

      {/* Lista de noticias */}
      {noticias.map(nota => (
        <div key={nota.id} style={{ 
          borderBottom: '1px solid #eee', 
          padding: '1.5rem 0'
        }}>
          {nota.imagen && (
            <img 
              src={nota.imagen} 
              alt={nota.titulo} 
              style={{ 
                width: '100%', 
                maxHeight: '350px', 
                objectFit: 'cover', 
                borderRadius: '16px', 
                marginBottom: '1rem',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
              }} 
            />
          )}
          {nota.video && (
            <div style={{ 
              position: 'relative', 
              paddingBottom: '56.25%', 
              height: 0, 
              marginBottom: '1rem',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              <iframe 
                src={nota.video} 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} 
                allowFullScreen 
                title={nota.titulo} 
              />
            </div>
          )}
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '400',
            fontFamily: "'Playfair Display', serif",
            marginBottom: '0.5rem'
          }}>
            {nota.titulo}
          </h3>
          <p style={{ color: '#555', lineHeight: '1.8' }}>{nota.contenido}</p>
        </div>
      ))}
    </div>
  );
}
