import { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner } from 'react-icons/fa';

export default function AsistenteIA() {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [conversacion, setConversacion] = useState([]);
  const [cargando, setCargando] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const respuestas = {
    'precio': 'Los precios varían según el software. En MarketSoft encontrarás los precios detallados de cada producto.',
    'cotizar': 'Ve a la sección Cotizar servicios, llena el formulario y te enviaremos un presupuesto personalizado.',
    'contacto': 'Puedes contactarnos en la sección Contacto o escribir a pdabasel1@gmail.com',
    'hola': '¡Hola! 👋 Soy el asistente de Prototipica Estudio. ¿En qué puedo ayudarte?',
    'gracias': '¡De nada! 😊 ¿Necesitas algo más?',
    'productos': 'En MarketSoft encontrarás nuestras herramientas digitales. Puedes verlas en la sección MarketSoft.'
  };

  const respuestaDefault = 'Gracias por tu consulta. Un asesor te contactará pronto. ¿Puedo ayudarte con algo más?';

  useEffect(() => {
    if (conversacion.length === 0) {
      setConversacion([{ tipo: 'bot', texto: '👋 ¡Hola! Soy el asistente de Prototipica Estudio. ¿En qué puedo ayudarte?' }]);
    }
  }, []);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [conversacion]);

  useEffect(() => {
    if (abierto && inputRef.current) setTimeout(() => inputRef.current.focus(), 300);
  }, [abierto]);

  const obtenerRespuesta = (pregunta) => {
    const lower = pregunta.toLowerCase();
    for (const [clave, respuesta] of Object.entries(respuestas)) {
      if (lower.includes(clave)) return respuesta;
    }
    return respuestaDefault;
  };

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;
    const usuario = { tipo: 'usuario', texto: mensaje.trim() };
    setConversacion(prev => [...prev, usuario]);
    setMensaje('');
    setCargando(true);
    setTimeout(() => {
      const respuesta = obtenerRespuesta(usuario.texto);
      setConversacion(prev => [...prev, { tipo: 'bot', texto: respuesta }]);
      setCargando(false);
    }, 800 + Math.random() * 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarMensaje(); }
  };

  return (
    <>
      {!abierto && (
        <button onClick={() => setAbierto(true)} style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #444 100%)', color: 'white',
          border: 'none', borderRadius: '50%', width: '64px', height: '64px', fontSize: '2rem',
          cursor: 'pointer', boxShadow: '0 4px 25px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <FaRobot />
          <span style={{
            position: 'absolute', bottom: '4px', right: '4px', width: '14px', height: '14px',
            background: '#4caf50', borderRadius: '50%', border: '2px solid white',
            animation: 'pulse 2s ease-in-out infinite'
          }} />
          <style>{`@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.9); } }`}</style>
        </button>
      )}

      {abierto && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
          width: 'min(400px, 90vw)', height: 'min(550px, 75vh)',
          background: 'white', borderRadius: '20px', boxShadow: '0 8px 50px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          animation: 'slideUp 0.3s ease'
        }}>
          <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
          <div style={{ padding: '1rem 1.2rem', background: 'linear-gradient(135deg, #1a1a1a 0%, #444 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}><FaRobot /></div>
              <div><div style={{ fontWeight: '500' }}>Asistente IA</div><div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Prototipica Estudio</div></div>
            </div>
            <button onClick={() => setAbierto(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem', padding: '0.3rem' }}><FaTimes /></button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: '#f8f8f8', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {conversacion.map((msg, i) => (
              <div key={i} style={{ maxWidth: '85%', alignSelf: msg.tipo === 'usuario' ? 'flex-end' : 'flex-start', background: msg.tipo === 'usuario' ? '#1a1a1a' : 'white', color: msg.tipo === 'usuario' ? 'white' : '#1a1a1a', padding: '0.7rem 1rem', borderRadius: msg.tipo === 'usuario' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', fontSize: '0.95rem', lineHeight: '1.6', border: msg.tipo === 'bot' ? '1px solid #eee' : 'none' }}>{msg.texto}</div>
            ))}
            {cargando && <div style={{ alignSelf: 'flex-start', background: 'white', padding: '0.7rem 1rem', borderRadius: '4px 16px 16px 16px', border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaSpinner style={{ animation: 'spin 1s linear infinite' }} /><span style={{ color: '#888', fontSize: '0.9rem' }}>Escribiendo...</span><style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>}
            <div ref={chatEndRef} />
          </div>
          <div style={{ padding: '0.8rem 1rem', borderTop: '1px solid #eee', background: 'white', display: 'flex', gap: '0.6rem' }}>
            <input ref={inputRef} type="text" value={mensaje} onChange={(e) => setMensaje(e.target.value)} onKeyPress={handleKeyPress} placeholder="Escribe tu pregunta..." style={{ flex: 1, padding: '0.7rem 1rem', border: '1px solid #ddd', borderRadius: '24px', fontSize: '0.95rem', outline: 'none' }} disabled={cargando} />
            <button onClick={enviarMensaje} disabled={!mensaje.trim() || cargando} style={{ background: (!mensaje.trim() || cargando) ? '#ccc' : '#1a1a1a', color: 'white', border: 'none', borderRadius: '50%', width: '44px', height: '44px', cursor: (!mensaje.trim() || cargando) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}><FaPaperPlane /></button>
          </div>
          <div style={{ padding: '0.3rem 1rem', background: '#f8f8f8', textAlign: 'center', fontSize: '0.6rem', color: '#bbb', borderTop: '1px solid #eee' }}>Prototipica Estudio · Asistente virtual</div>
        </div>
      )}
    </>
  );
}