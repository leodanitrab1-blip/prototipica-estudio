import { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner } from 'react-icons/fa';

export default function AsistenteIA() {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [conversacion, setConversacion] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [primeraVez, setPrimeraVez] = useState(true);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Respuestas predefinidas (IA simulada)
  const respuestasInteligentes = {
    'precio': 'Nuestros software van desde $1,499 hasta $5,999 MXN dependiendo de la complejidad y funcionalidades. En MarketSoft encontrarás todos los precios detallados.',
    'cotizar': 'Para cotizar un servicio, ve a la sección 📋 Cotizar servicios en el menú. Llena el formulario con tu nombre, correo y descripción del proyecto. Te enviaremos un presupuesto personalizado en 24-48 horas.',
    'contacto': 'Puedes contactarnos por correo a contacto@prototipica.com, por teléfono al +52 55 1234 5678, o a través de nuestro formulario de contacto en la sección 📬 Contacto.',
    'pago': 'Aceptamos pagos con tarjeta de crédito/débito, transferencia bancaria y PayPal. Todos los pagos son seguros y procesados a través de MercadoPago. Los datos de pago se envían directamente a nuestra cuenta bancaria.',
    'garantia': 'Todos nuestros software incluyen 30 días de garantía y soporte técnico gratuito. Si tienes problemas, nuestro equipo te ayudará a resolverlos.',
    'tiempo': 'El tiempo de entrega de un proyecto depende de su complejidad. Para proyectos pequeños (sitios web) de 1-2 semanas. Para proyectos grandes (aplicaciones completas) de 4-8 semanas.',
    'quienes': 'Somos Prototipica Estudio, un estudio de programación especializado en soluciones digitales a medida. Desarrollamos software, aplicaciones móviles y sitios web profesionales.',
    'hola': '¡Hola! 👋 Soy el asistente virtual de Prototipica Estudio. ¿En qué puedo ayudarte hoy?',
    'gracias': '¡De nada! 😊 Estoy aquí para ayudarte. Si necesitas algo más, no dudes en preguntar.',
    'adios': '¡Hasta luego! 👋 Si necesitas ayuda, aquí estaré. ¡Que tengas un excelente día!',
    'productos': 'En MarketSoft encontrarás nuestras herramientas digitales: Sistema POS Pro ($2,999 MXN), Gestor de Proyectos Ágil ($1,499 MXN), CRM para PyMEs ($2,499 MXN) y más. Todos con garantía y soporte incluido.'
  };

  // Respuesta por defecto cuando no encuentra coincidencia
  const respuestaDefault = 'Gracias por tu consulta. Un asesor de Prototipica Estudio te contactará pronto para brindarte más información. Mientras tanto, ¿puedo ayudarte con algo más?';

  // Mensaje de bienvenida
  const mensajeBienvenida = {
    tipo: 'bot',
    texto: '👋 ¡Hola! Soy el asistente virtual de Prototipica Estudio. Puedo ayudarte con información sobre precios, cotizaciones, productos, pagos y más. ¿Qué te gustaría saber?'
  };

  // Inicializar conversación
  useEffect(() => {
    if (primeraVez && !abierto) {
      setConversacion([mensajeBienvenida]);
      setPrimeraVez(false);
    }
  }, [primeraVez, abierto]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversacion]);

  // Enfocar input al abrir
  useEffect(() => {
    if (abierto && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [abierto]);

  // Función para obtener respuesta
  const obtenerRespuesta = (pregunta) => {
    const preguntaLower = pregunta.toLowerCase();
    
    // Buscar coincidencia exacta
    for (const [clave, respuesta] of Object.entries(respuestasInteligentes)) {
      if (preguntaLower.includes(clave)) {
        return respuesta;
      }
    }
    
    // Buscar palabras clave
    const palabrasClave = {
      'costo': 'precio',
      'cuánto': 'precio',
      'valor': 'precio',
      'presupuesto': 'precio',
      'precios': 'precio',
      'cotizacion': 'cotizar',
      'cotización': 'cotizar',
      'contactar': 'contacto',
      'comunicarse': 'contacto',
      'llamar': 'contacto',
      'pagar': 'pago',
      'tarjeta': 'pago',
      'transferencia': 'pago',
      'garantizado': 'garantia',
      'falla': 'garantia',
      'soporte': 'garantia',
      'entrega': 'tiempo',
      'plazo': 'tiempo',
      'duración': 'tiempo',
      'estudio': 'quienes',
      'empresa': 'quienes',
      'somos': 'quienes',
      'saludo': 'hola',
      'buenas': 'hola',
      'agradecer': 'gracias',
      'chao': 'adios',
      'hasta luego': 'adios',
      'adiós': 'adios',
      'producto': 'productos',
      'software': 'productos',
      'herramientas': 'productos'
    };
    
    for (const [palabra, clave] of Object.entries(palabrasClave)) {
      if (preguntaLower.includes(palabra)) {
        return respuestasInteligentes[clave];
      }
    }
    
    return respuestaDefault;
  };

  // Enviar mensaje
  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;

    const mensajeUsuario = {
      tipo: 'usuario',
      texto: mensaje.trim()
    };

    setConversacion(prev => [...prev, mensajeUsuario]);
    setMensaje('');
    setCargando(true);

    // Simular tiempo de respuesta de IA
    setTimeout(() => {
      const respuesta = obtenerRespuesta(mensajeUsuario.texto);
      const mensajeBot = {
        tipo: 'bot',
        texto: respuesta
      };
      setConversacion(prev => [...prev, mensajeBot]);
      setCargando(false);
    }, 800 + Math.random() * 600);
  };

  // Manejar tecla Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  // Resetear conversación
  const resetearConversacion = () => {
    setConversacion([mensajeBienvenida]);
  };

  return (
    <>
      {/* ===== BOTÓN FLOTANTE (BURBUJA) ===== */}
      {!abierto && (
        <button
          onClick={() => setAbierto(true)}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 9999,
            background: '#1a1a1a',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '64px',
            height: '64px',
            fontSize: '2rem',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = '0 6px 30px rgba(0,0,0,0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)';
          }}
          aria-label="Abrir asistente virtual"
        >
          <FaRobot />
          {/* Indicador de actividad */}
          <span style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            width: '16px',
            height: '16px',
            backgroundColor: '#4caf50',
            borderRadius: '50%',
            border: '2px solid white',
            animation: 'pulse 2s ease-in-out infinite'
          }} />
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}</style>
        </button>
      )}

      {/* ===== VENTANA DEL CHAT ===== */}
      {abierto && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 9999,
          width: 'min(400px, 90vw)',
          height: 'min(600px, 80vh)',
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.3s ease'
        }}>
          <style>{`
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}</style>

          {/* ===== HEADER ===== */}
          <div style={{
            padding: '1rem 1.2rem',
            backgroundColor: '#1a1a1a',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                <FaRobot />
              </div>
              <div>
                <div style={{ fontWeight: '500', fontSize: '1rem' }}>
                  Asistente IA
                </div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                  {cargando ? 'Escribiendo...' : 'En línea'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={resetearConversacion}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                title="Reiniciar conversación"
              >
                ↻
              </button>
              <button
                onClick={() => setAbierto(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                aria-label="Cerrar asistente"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* ===== MENSAJES ===== */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem 1.2rem',
            backgroundColor: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}>
            {conversacion.map((msg, index) => (
              <div
                key={index}
                style={{
                  maxWidth: '85%',
                  alignSelf: msg.tipo === 'usuario' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.tipo === 'usuario' ? '#1a1a1a' : 'white',
                  color: msg.tipo === 'usuario' ? 'white' : '#1a1a1a',
                  padding: '0.8rem 1rem',
                  borderRadius: msg.tipo === 'usuario' 
                    ? '16px 4px 16px 16px' 
                    : '4px 16px 16px 16px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  wordWrap: 'break-word',
                  lineHeight: '1.6',
                  fontSize: '0.95rem',
                  border: msg.tipo === 'bot' ? '1px solid #eee' : 'none'
                }}
              >
                {msg.texto}
              </div>
            ))}
            
            {/* Indicador de carga */}
            {cargando && (
              <div style={{
                alignSelf: 'flex-start',
                backgroundColor: 'white',
                padding: '0.8rem 1rem',
                borderRadius: '4px 16px 16px 16px',
                border: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '0.9rem', color: '#888' }}>Pensando...</span>
                <style>{`
                  @keyframes spin {
                    to { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* ===== INPUT ===== */}
          <div style={{
            padding: '0.8rem 1rem',
            borderTop: '1px solid #eee',
            backgroundColor: 'white',
            display: 'flex',
            gap: '0.6rem',
            flexShrink: 0
          }}>
            <input
              ref={inputRef}
              type="text"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta..."
              style={{
                flex: 1,
                padding: '0.7rem 1rem',
                border: '1px solid #ddd',
                borderRadius: '24px',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#888'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
              disabled={cargando}
            />
            <button
              onClick={enviarMensaje}
              disabled={!mensaje.trim() || cargando}
              style={{
                background: (!mensaje.trim() || cargando) ? '#ccc' : '#1a1a1a',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                cursor: (!mensaje.trim() || cargando) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                if (mensaje.trim() && !cargando) {
                  e.target.style.background = '#333';
                }
              }}
              onMouseLeave={(e) => {
                if (mensaje.trim() && !cargando) {
                  e.target.style.background = '#1a1a1a';
                }
              }}
              aria-label="Enviar mensaje"
            >
              <FaPaperPlane />
            </button>
          </div>

          {/* ===== FOOTER DEL CHAT ===== */}
          <div style={{
            padding: '0.4rem 1rem',
            backgroundColor: '#fafafa',
            borderTop: '1px solid #f0f0f0',
            textAlign: 'center',
            fontSize: '0.65rem',
            color: '#bbb',
            flexShrink: 0
          }}>
            Prototipica Estudio · Asistente virtual
          </div>
        </div>
      )}
    </>
  );
}