import { useState, useEffect } from 'react';
import { getNoticias, addNoticia, deleteNoticia, updateNoticia } from '../firebase';

export default function SeccionCentral() {
  const [noticias, setNoticias] = useState([]);
  const [modoAdmin, setModoAdmin] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [cargando, setCargando] = useState(true);
  const ADMIN_PASSWORD = 'prototipica2026';

  useEffect(() => {
    cargarNoticias();
  }, []);

  const cargarNoticias = async () => {
    try {
      setCargando(true);
      console.log('📰 Cargando noticias desde Firebase...');
      const data = await getNoticias();
      console.log('✅ Noticias cargadas:', data);
      setNoticias(data);
    } catch (error) {
      console.error('❌ Error al cargar noticias:', error);
    } finally {
      setCargando(false);
    }
  };

  const agregarNoticia = async () => {
    const nueva = {
      titulo: 'Nueva noticia',
      contenido: 'Escribe aquí el contenido...',
      imagen: '',
      video: '',
      fecha: new Date().toISOString()
    };
    try {
      const noticia = await addNoticia(nueva);
      console.log('✅ Noticia agregada:', noticia);
      setNoticias([...noticias, noticia]);
    } catch (error) {
      alert('Error al agregar noticia');
    }
  };

  const eliminarNoticia = async (id) => {
    if (!window.confirm('¿Eliminar esta noticia?')) return;
    try {
      await deleteNoticia(id);
      setNoticias(noticias.filter(n => n.id !== id));
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const actualizarNoticia = async (id, campo, valor) => {
    const noticia = noticias.find(n => n.id === id);
    if (!noticia) return;
    const actualizada = { ...noticia, [campo]: valor };
    try {
      await updateNoticia(id, { [campo]: valor });
      setNoticias(noticias.map(n => n.id === id ? actualizada : n));
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

  if (cargando) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>Cargando noticias...</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
      <h2 onClick={handleTituloClick} style={{
        fontSize: '2rem', fontWeight: '300', cursor: 'pointer', userSelect: 'none',
        display: 'flex', alignItems: 'center', gap: '1rem'
      }}>
        📰 Noticias
        {modoAdmin && <span style={{ fontSize: '0.7rem', background: '#1a1a1a', color: 'white', padding: '0.2rem 0.8rem', borderRadius: '20px' }}>Admin</span>}
      </h2>

      {mostrarLogin && !modoAdmin && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{ background: 'white', borderRadius: '16px', maxWidth: '400px', width: '100%', padding: '2rem', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem' }}>🔒 Acceso de administrador</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Ingresa la contraseña para administrar las noticias.</p>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña..." style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '0.8rem', fontSize: '1rem' }} onKeyPress={(e) => e.key === 'Enter' && handleLogin()} />
            {errorPassword && <p style={{ color: '#c62828', fontSize: '0.9rem', marginBottom: '0.8rem' }}>{errorPassword}</p>}
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button onClick={handleLogin} style={{ flex: 1, background: '#1a1a1a', color: 'white', padding: '0.8rem', border: 'none', borderRadius: '40px', cursor: 'pointer', fontSize: '1rem' }}>Ingresar</button>
              <button onClick={() => { setMostrarLogin(false); setPassword(''); setErrorPassword(''); }} style={{ flex: 1, background: '#eee', color: '#333', padding: '0.8rem', border: 'none', borderRadius: '40px', cursor: 'pointer', fontSize: '1rem' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {modoAdmin && (
        <div style={{ border: '2px dashed #1a1a1a', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', background: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3>✏️ Editor de Noticias</h3>
            <button onClick={() => setModoAdmin(false)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}>Cerrar</button>
          </div>
          {noticias.map((nota) => (
            <div key={nota.id} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', background: 'white', borderRadius: '8px' }}>
              <input value={nota.titulo} onChange={(e) => actualizarNoticia(nota.id, 'titulo', e.target.value)} placeholder="Título" style={{ marginBottom: '0.5rem', width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }} />
              <textarea value={nota.contenido} onChange={(e) => actualizarNoticia(nota.id, 'contenido', e.target.value)} placeholder="Contenido" rows="3" style={{ marginBottom: '0.5rem', width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', resize: 'vertical' }} />
              <input value={nota.imagen} onChange={(e) => actualizarNoticia(nota.id, 'imagen', e.target.value)} placeholder="URL de imagen" style={{ marginBottom: '0.5rem', width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }} />
              <input value={nota.video} onChange={(e) => actualizarNoticia(nota.id, 'video', e.target.value)} placeholder="URL de video (YouTube embed)" style={{ marginBottom: '0.5rem', width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }} />
              <button onClick={() => eliminarNoticia(nota.id)} style={{ background: '#ff4444', color: 'white', border: 'none', padding: '0.3rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>🗑️ Eliminar</button>
            </div>
          ))}
          <button onClick={agregarNoticia} style={{ background: '#1a1a1a', color: 'white', padding: '0.8rem', border: 'none', borderRadius: '8px', width: '100%', cursor: 'pointer' }}>➕ Agregar noticia</button>
        </div>
      )}

      {noticias.length === 0 && !modoAdmin && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
          <p>📭 No hay noticias</p>
          <p style={{ fontSize: '0.9rem' }}>Haz clic en "Noticias" para acceder al panel de administración</p>
        </div>
      )}

      {noticias.map(nota => (
        <div key={nota.id} style={{ borderBottom: '1px solid #eee', padding: '1.5rem 0' }}>
          {nota.imagen && <img src={nota.imagen} alt={nota.titulo} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />}
          {nota.video && <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: '1rem' }}><iframe src={nota.video} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen title={nota.titulo} /></div>}
          <h3 style={{ fontSize: '1.5rem', fontWeight: '400' }}>{nota.titulo}</h3>
          <p style={{ color: '#555', lineHeight: '1.8' }}>{nota.contenido}</p>
        </div>
      ))}
    </div>
  );
}
