import { useState } from 'react';
import { FiMail, FiUser, FiMessageSquare, FiSend, FiCheckCircle, FiMapPin } from 'react-icons/fi';

export default function Contacto({ idioma }) {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const textos = {
    es: {
      titulo: 'Contacto',
      descripcion: '¿Tienes alguna pregunta? Contáctanos.',
      correo: 'Correo',
      ubicacion: 'Ubicación',
      mexico: 'México',
      nombre: 'Nombre',
      email: 'Correo electrónico',
      mensaje: 'Mensaje',
      enviar: 'Enviar mensaje',
      enviando: 'Enviando...',
      exito: '¡Mensaje enviado!',
      exitoDesc: 'Te responderemos lo antes posible.',
      enviarOtro: 'Enviar otro',
      errorCampos: 'Todos los campos son obligatorios.',
      errorServidor: 'Error al enviar el mensaje.',
      errorRed: 'No se pudo conectar con el servidor. Inténtalo de nuevo.'
    },
    en: {
      titulo: 'Contact',
      descripcion: 'Do you have any questions? Contact us.',
      correo: 'Email',
      ubicacion: 'Location',
      mexico: 'Mexico',
      nombre: 'Name',
      email: 'Email',
      mensaje: 'Message',
      enviar: 'Send message',
      enviando: 'Sending...',
      exito: 'Message sent!',
      exitoDesc: 'We will respond as soon as possible.',
      enviarOtro: 'Send another',
      errorCampos: 'All fields are required.',
      errorServidor: 'Error sending message.',
      errorRed: 'Could not connect to server. Please try again.'
    }
  };

  const t = textos[idioma] || textos.es;
  const API_URL = 'https://prototipica-estudio.onrender.com/api/enviar-correo';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.nombre || !form.email || !form.mensaje) {
      setError('⚠️ ' + t.errorCampos);
      return;
    }

    setError('');
    setEnviando(true);
    setEnviado(false);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          tipo: 'contacto'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setEnviado(true);
        setForm({ nombre: '', email: '', mensaje: '' });
      } else {
        const errorData = await response.json();
        setError(errorData.error || '❌ ' + t.errorServidor);
      }
    } catch (err) {
      setError('❌ ' + t.errorRed);
    } finally {
      setEnviando(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.8rem 0.8rem 0.8rem 2.5rem',
    border: '1px solid #ddd',
    borderRadius: '12px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: "'Inter', sans-serif"
  };

  const iconStyle = {
    position: 'absolute',
    left: '0.8rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#999',
    fontSize: '1rem',
    pointerEvents: 'none'
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1rem' }}>
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
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: '300', 
          marginBottom: '0.5rem',
          color: 'white',
          fontFamily: "'Playfair Display', serif",
          position: 'relative'
        }}>
          📬 {t.titulo}
        </h2>
        <p style={{ 
          color: '#ccc', 
          marginBottom: 0,
          position: 'relative',
          fontSize: '0.95rem'
        }}>
          {t.descripcion}
        </p>
      </div>

      {/* Tarjetas de información */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          padding: '1.5rem', 
          border: '1px solid #eee', 
          borderRadius: '16px', 
          textAlign: 'center',
          background: 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.8rem',
            color: '#c9a96e'
          }}>
            <FiMail size={20} />
          </div>
          <p style={{ fontSize: '0.75rem', color: '#999', margin: '0 0 0.3rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
            {t.correo}
          </p>
          <p style={{ fontWeight: '600', margin: 0, fontSize: '0.9rem' }}>pdabasel1@gmail.com</p>
        </div>

        <div style={{ 
          padding: '1.5rem', 
          border: '1px solid #eee', 
          borderRadius: '16px', 
          textAlign: 'center',
          background: 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.8rem',
            color: '#c9a96e'
          }}>
            <FiMapPin size={20} />
          </div>
          <p style={{ fontSize: '0.75rem', color: '#999', margin: '0 0 0.3rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
            {t.ubicacion}
          </p>
          <p style={{ fontWeight: '600', margin: 0, fontSize: '0.9rem' }}>{t.mexico}</p>
        </div>
      </div>

      {enviado ? (
        <div style={{ 
          background: '#f0f7f0', 
          border: '1px solid #c8e6c9', 
          borderRadius: '20px', 
          padding: '3rem 2rem', 
          textAlign: 'center',
          animation: 'fadeInUp 0.5s ease'
        }}>
          <div style={{ 
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 10px 30px rgba(76,175,80,0.3)'
          }}>
            <FiCheckCircle size={40} color="white" />
          </div>
          <h3 style={{ 
            color: '#2e7d32',
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.5rem',
            marginBottom: '0.5rem'
          }}>
            {t.exito}
          </h3>
          <p style={{ color: '#555', marginBottom: '1.5rem' }}>{t.exitoDesc}</p>
          <button 
            onClick={() => setEnviado(false)} 
            style={{
              background: 'transparent',
              border: '2px solid #2e7d32',
              color: '#2e7d32',
              padding: '0.7rem 2rem',
              borderRadius: '40px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2e7d32';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#2e7d32';
            }}
          >
            {t.enviarOtro}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 5px 30px rgba(0,0,0,0.08)'
        }}>
          {error && (
            <div style={{ 
              background: '#fff0f0', 
              border: '1px solid #ffcdd2', 
              padding: '1rem 1.2rem', 
              borderRadius: '12px', 
              color: '#c62828', 
              marginBottom: '1.5rem',
              animation: 'fadeIn 0.3s ease',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}
          
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ 
              fontWeight: '600', 
              display: 'block', 
              marginBottom: '0.4rem',
              fontSize: '0.9rem',
              color: '#333'
            }}>
              {t.nombre} *
            </label>
            <div style={{ position: 'relative' }}>
              <FiUser style={iconStyle} />
              <input 
                type="text" 
                name="nombre" 
                value={form.nombre} 
                onChange={handleChange} 
                required 
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1a1a1a';
                  e.target.style.boxShadow = '0 0 0 3px rgba(26,26,26,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ddd';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ 
              fontWeight: '600', 
              display: 'block', 
              marginBottom: '0.4rem',
              fontSize: '0.9rem',
              color: '#333'
            }}>
              {t.email} *
            </label>
            <div style={{ position: 'relative' }}>
              <FiMail style={iconStyle} />
              <input 
                type="email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                required 
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1a1a1a';
                  e.target.style.boxShadow = '0 0 0 3px rgba(26,26,26,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ddd';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              fontWeight: '600', 
              display: 'block', 
              marginBottom: '0.4rem',
              fontSize: '0.9rem',
              color: '#333'
            }}>
              {t.mensaje} *
            </label>
            <div style={{ position: 'relative' }}>
              <FiMessageSquare style={{ ...iconStyle, top: '1rem' }} />
              <textarea 
                name="mensaje" 
                value={form.mensaje} 
                onChange={handleChange} 
                rows="4" 
                required 
                style={{
                  ...inputStyle,
                  paddingLeft: '2.5rem',
                  resize: 'vertical',
                  minHeight: '120px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1a1a1a';
                  e.target.style.boxShadow = '0 0 0 3px rgba(26,26,26,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ddd';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={enviando} 
            style={{
              width: '100%',
              background: enviando 
                ? '#888' 
                : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
              color: 'white',
              padding: '1rem',
              border: 'none',
              borderRadius: '40px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: enviando ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: enviando ? 'none' : '0 4px 20px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={(e) => {
              if (!enviando) {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!enviando) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
              }
            }}
          >
            {enviando ? (
              <>
                <span style={{ 
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                {t.enviando}
              </>
            ) : (
              <>
                <FiSend /> {t.enviar}
              </>
            )}
          </button>
        </form>
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
