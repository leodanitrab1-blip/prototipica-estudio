import { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner, FaMicrophone, FaRegSmile } from 'react-icons/fa';

export default function AsistenteIA({ idioma }) {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [conversacion, setConversacion] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [escribiendo, setEscribiendo] = useState(false);
  const [sugerencias, setSugerencias] = useState([]);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Base de conocimiento ampliada
  const baseConocimiento = {
    es: {
      saludos: {
        palabras: ['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'que tal', 'saludos'],
        respuestas: [
          '¡Hola! 👋 ¿Cómo estás? Soy el asistente de Prototipica Estudio. ¿En qué puedo ayudarte hoy?',
          '¡Hey! Qué gusto verte por aquí. ¿Qué te gustaría saber sobre nuestros servicios?',
          '¡Hola! Bienvenido. Estoy aquí para ayudarte con lo que necesites.',
          '¡Saludos! ¿En qué podemos ayudarte hoy?'
        ]
      },
      precios: {
        palabras: ['precio', 'costo', 'cuanto cuesta', 'cuanto vale', 'precios', 'tarifas', 'valor'],
        respuestas: [
          'Los precios varían según el proyecto. Tenemos opciones desde $1,499 MXN hasta soluciones más completas. Lo mejor es que veas el MarketSoft para ver los productos actuales 😊',
          'Cada proyecto es diferente. Te recomiendo cotizar sin compromiso para darte un precio exacto según lo que necesites.',
          'En MarketSoft encontrarás precios de productos ya desarrollados. Si necesitas algo personalizado, la cotización es gratis.'
        ]
      },
      cotizacion: {
        palabras: ['cotizar', 'cotizacion', 'presupuesto', 'cuanto', 'proyecto personalizado', 'a medida'],
        respuestas: [
          'Claro, podemos hacer una cotización sin compromiso. Ve a la sección "Cotizar" y cuéntanos tu idea, te respondemos rápido.',
          '¡Buena idea! Llena el formulario de cotización y te enviamos un presupuesto detallado. No te preocupes, es gratis.',
          'Para cotizar solo necesitamos saber qué tienes en mente. La sección "Cotizar" es el lugar indicado.'
        ]
      },
      contacto: {
        palabras: ['contacto', 'contactar', 'email', 'correo', 'hablar', 'comunicar', 'whatsapp'],
        respuestas: [
          'Puedes escribirnos a pdabasel1@gmail.com o usar el formulario de contacto. Respondemos lo antes posible 😊',
          'La forma más directa es por email: pdabasel1@gmail.com. También hay un formulario en la sección Contacto.',
          'Nos encantaría escucharte. Escríbenos a pdabasel1@gmail.com y te respondemos.'
        ]
      },
      productos: {
        palabras: ['productos', 'software', 'herramientas', 'aplicaciones', 'sistemas', 'pos', 'marketsoft', 'tienda'],
        respuestas: [
          'Tenemos varios productos en MarketSoft. Son herramientas que hemos desarrollado y que ya están listas para usar. ¿Te gustaría saber más?',
          'En la sección MarketSoft verás lo que tenemos disponible. Si no encuentras lo que buscas, lo podemos desarrollar 😊',
          'Nuestros productos están en MarketSoft. Son soluciones prácticas que hemos ido creando. Échales un ojo.'
        ]
      },
      servicios: {
        palabras: ['servicio', 'servicios', 'que hacen', 'que ofrecen', 'desarrollo', 'que es'],
        respuestas: [
          'Básicamente hacemos software a la medida. Páginas web, sistemas de gestión, tiendas en línea... lo que necesites, lo platicamos sin compromiso.',
          'Nos dedicamos al desarrollo de software. Desde sitios web hasta sistemas más completos. Cada proyecto es diferente.',
          'Creamos soluciones digitales. Si tienes una idea, la desarrollamos contigo. Siempre buscando lo mejor para tu proyecto.'
        ]
      },
      gracias: {
        palabras: ['gracias', 'agradezco', 'genial', 'excelente', 'perfecto'],
        respuestas: [
          '¡De nada! 😊 Cualquier cosa que necesites, aquí estoy.',
          '¡Para eso estamos! ¿Algo más en lo que pueda ayudarte?',
          '¡Gracias a ti por visitarnos! ¿Necesitas algo más?'
        ]
      },
      despedida: {
        palabras: ['adios', 'chao', 'hasta luego', 'nos vemos', 'bye'],
        respuestas: [
          '¡Hasta luego! 👋 Gracias por visitar Prototipica Estudio.',
          '¡Nos vemos! Cualquier duda, ya sabes dónde encontrarnos 😊',
          '¡Adiós! Esperamos verte pronto por aquí.'
        ]
      },
      tiempo: {
        palabras: ['cuanto tarda', 'tiempo', 'plazo', 'entrega', 'cuando'],
        respuestas: [
          'Depende del proyecto. Algo sencillo puede estar en una semana, proyectos más grandes toman más tiempo. Lo vemos en la cotización 😊',
          'Cada proyecto tiene su ritmo. Te damos un estimado cuando sabemos exactamente qué necesitas.',
          'El tiempo varía según la complejidad. Pero siempre buscamos entregar lo antes posible con calidad.'
        ]
      },
      calidad: {
        palabras: ['calidad', 'confiable', 'seguro', 'garantia', 'soporte'],
        respuestas: [
          'Nos esforzamos por hacer las cosas bien. No somos perfectos, pero siempre buscamos mejorar y dar lo mejor 😊',
          'Ofrecemos soporte después de entregar el proyecto. Si algo sale mal, lo arreglamos.',
          'La calidad es importante para nosotros. No entregamos algo con lo que no estemos satisfechos.'
        ]
      }
    },
    en: {
      saludos: {
        palabras: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'greetings'],
        respuestas: [
          'Hello! 👋 How are you? I\'m the Prototipica Estudio assistant. How can I help you today?',
          'Hey! Nice to see you here. What would you like to know about our services?',
          'Hello! Welcome. I\'m here to help you with whatever you need.'
        ]
      },
      precios: {
        palabras: ['price', 'cost', 'how much', 'pricing', 'rates', 'value'],
        respuestas: [
          'Prices vary by project. We have options from $1,499 MXN. Check MarketSoft for current products 😊',
          'Each project is different. I recommend getting a free quote for an exact price.',
          'In MarketSoft you\'ll find prices for ready products. For custom work, quotes are free.'
        ]
      },
      cotizacion: {
        palabras: ['quote', 'quotation', 'budget', 'estimate', 'custom project'],
        respuestas: [
          'Sure, we can do a no-obligation quote. Go to "Quote" and tell us your idea, we\'ll respond quickly.',
          'Good idea! Fill out the quote form and we\'ll send you a detailed estimate. Don\'t worry, it\'s free.',
          'To quote, we just need to know what you have in mind. The "Quote" section is the place.'
        ]
      },
      contacto: {
        palabras: ['contact', 'email', 'talk', 'communicate', 'reach'],
        respuestas: [
          'You can email us at pdabasel1@gmail.com or use the contact form. We respond as soon as possible 😊',
          'The most direct way is email: pdabasel1@gmail.com. There\'s also a form in the Contact section.',
          'We\'d love to hear from you. Email us at pdabasel1@gmail.com.'
        ]
      },
      productos: {
        palabras: ['products', 'software', 'tools', 'applications', 'systems', 'pos', 'store'],
        respuestas: [
          'We have several products in MarketSoft. They\'re tools we\'ve developed and are ready to use. Want to know more?',
          'In MarketSoft you\'ll see what we have available. If you don\'t find what you need, we can develop it 😊',
          'Our products are in MarketSoft. They\'re practical solutions we\'ve been creating. Take a look.'
        ]
      },
      servicios: {
        palabras: ['service', 'services', 'what do you do', 'what do you offer', 'development'],
        respuestas: [
          'We basically make custom software. Websites, management systems, online stores... whatever you need, let\'s talk.',
          'We\'re dedicated to software development. From websites to complete systems. Each project is different.',
          'We create digital solutions. If you have an idea, we develop it with you.'
        ]
      },
      gracias: {
        palabras: ['thanks', 'thank you', 'great', 'excellent', 'perfect'],
        respuestas: [
          'You\'re welcome! 😊 Anything else I can help with?',
          'That\'s what we\'re here for! Need anything else?',
          'Thank you for visiting! Do you need anything else?'
        ]
      },
      despedida: {
        palabras: ['goodbye', 'bye', 'see you', 'later', 'farewell'],
        respuestas: [
          'See you later! 👋 Thanks for visiting Prototipica Estudio.',
          'Goodbye! Any questions, you know where to find us 😊',
          'Bye! Hope to see you around here soon.'
        ]
      },
      tiempo: {
        palabras: ['how long', 'time', 'deadline', 'delivery', 'when'],
        respuestas: [
          'Depends on the project. Simple work can be done in a week, bigger projects take longer. We\'ll discuss in the quote 😊',
          'Each project has its own pace. We give an estimate once we know exactly what you need.',
          'Time varies by complexity. But we always aim to deliver as fast as possible with quality.'
        ]
      },
      calidad: {
        palabras: ['quality', 'reliable', 'secure', 'guarantee', 'support'],
        respuestas: [
          'We strive to do things well. We\'re not perfect, but we always look to improve 😊',
          'We offer support after delivering the project. If something goes wrong, we fix it.',
          'Quality is important to us. We don\'t deliver something we\'re not satisfied with.'
        ]
      }
    }
  };

  const sugerenciasPorIdioma = {
    es: [
      '💬 ¿Qué servicios ofrecen?',
      '💰 ¿Cuánto cuesta un proyecto?',
      '🛠️ ¿Qué productos tienen?',
      '📞 ¿Cómo los contacto?'
    ],
    en: [
      '💬 What services do you offer?',
      '💰 How much does a project cost?',
      '🛠️ What products do you have?',
      '📞 How do I contact you?'
    ]
  };

  useEffect(() => {
    if (conversacion.length === 0) {
      const saludoInicial = idioma === 'en' 
        ? '👋 Hello! I\'m the Prototipica Estudio assistant. What can I help you with?'
        : '👋 ¡Hola! Soy el asistente de Prototipica Estudio. ¿En qué puedo ayudarte?';
      setConversacion([{ tipo: 'bot', texto: saludoInicial }]);
      setSugerencias(sugerenciasPorIdioma[idioma] || sugerenciasPorIdioma.es);
    }
  }, [idioma]);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [conversacion, cargando]);

  useEffect(() => {
    if (abierto && inputRef.current) setTimeout(() => inputRef.current.focus(), 300);
  }, [abierto]);

  const obtenerRespuestaInteligente = (pregunta) => {
    const lower = pregunta.toLowerCase();
    const conocimiento = baseConocimiento[idioma] || baseConocimiento.es;
    
    // Buscar en todas las categorías
    for (const [categoria, datos] of Object.entries(conocimiento)) {
      for (const palabra of datos.palabras) {
        if (lower.includes(palabra)) {
          // Elegir respuesta aleatoria de la categoría
          const respuestas = datos.respuestas;
          return respuestas[Math.floor(Math.random() * respuestas.length)];
        }
      }
    }
    
    // Respuestas por defecto más naturales
    const defaults = idioma === 'en' 
      ? [
          'Good question! We can talk about it. Send us an email at pdabasel1@gmail.com and we\'ll get back to you 😊',
          'I\'m not sure about that, but you can ask us directly at pdabasel1@gmail.com. We\'ll be happy to help!',
          'Interesting question! The best way is to email us at pdabasel1@gmail.com. We respond quickly.',
          'I\'m learning every day! For that specific question, write to pdabasel1@gmail.com and we\'ll help you personally.'
        ]
      : [
          'Buena pregunta. Podemos platicarlo. Escríbenos a pdabasel1@gmail.com y te respondemos 😊',
          'No estoy seguro de eso, pero puedes preguntarnos directo en pdabasel1@gmail.com. ¡Con gusto te ayudamos!',
          'Interesante pregunta. Lo mejor es que nos escribas a pdabasel1@gmail.com. Respondemos rápido.',
          '¡Cada día aprendo algo nuevo! Para esa pregunta específica, escríbenos a pdabasel1@gmail.com y te ayudamos personalmente.'
        ];
    
    return defaults[Math.floor(Math.random() * defaults.length)];
  };

  const enviarMensaje = async (textoMensaje = null) => {
    const texto = textoMensaje || mensaje;
    if (!texto.trim() || cargando) return;
    
    const usuario = { tipo: 'usuario', texto: texto.trim() };
    setConversacion(prev => [...prev, usuario]);
    setMensaje('');
    setCargando(true);
    setEscribiendo(true);
    setSugerencias([]);
    
    // Simular tiempo de pensamiento
    const tiempoRespuesta = 800 + Math.random() * 1200;
    
    setTimeout(() => {
      const respuesta = obtenerRespuestaInteligente(usuario.texto);
      setConversacion(prev => [...prev, { tipo: 'bot', texto: respuesta }]);
      setCargando(false);
      setEscribiendo(false);
      // Mostrar sugerencias de nuevo
      setSugerencias(sugerenciasPorIdioma[idioma] || sugerenciasPorIdioma.es);
    }, tiempoRespuesta);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      enviarMensaje(); 
    }
  };

  return (
    <>
      {!abierto && (
        <button 
          onClick={() => setAbierto(true)} 
          style={{
            position: 'fixed', 
            bottom: '2rem', 
            right: '2rem', 
            zIndex: 9999,
            background: 'linear-gradient(135deg, #1a1a1a 0%, #444 100%)', 
            color: 'white',
            border: 'none', 
            borderRadius: '50%', 
            width: '64px', 
            height: '64px', 
            fontSize: '2rem',
            cursor: 'pointer', 
            boxShadow: '0 4px 25px rgba(0,0,0,0.3)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 8px 35px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 25px rgba(0,0,0,0.3)';
          }}
        >
          <FaRobot />
          <span style={{
            position: 'absolute', 
            bottom: '4px', 
            right: '4px', 
            width: '14px', 
            height: '14px',
            background: '#4caf50', 
            borderRadius: '50%', 
            border: '2px solid white',
            animation: 'pulse 2s ease-in-out infinite'
          }} />
        </button>
      )}

      {abierto && (
        <div style={{
          position: 'fixed', 
          bottom: '2rem', 
          right: '2rem', 
          zIndex: 9999,
          width: 'min(400px, 90vw)', 
          height: 'min(600px, 80vh)',
          background: 'white', 
          borderRadius: '24px', 
          boxShadow: '0 10px 60px rgba(0,0,0,0.3)',
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          {/* Header */}
          <div style={{ 
            padding: '1.2rem', 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: 'rgba(255,255,255,0.15)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.3rem',
                position: 'relative'
              }}>
                <FaRobot />
                <span style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '10px',
                  height: '10px',
                  background: '#4caf50',
                  borderRadius: '50%',
                  border: '2px solid white'
                }} />
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '1rem' }}>
                  {idioma === 'en' ? 'AI Assistant' : 'Asistente IA'}
                </div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                  {idioma === 'en' ? 'Prototipica Estudio' : 'Prototipica Estudio'} · {escribiendo ? (idioma === 'en' ? 'typing...' : 'escribiendo...') : (idioma === 'en' ? 'online' : 'en línea')}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setAbierto(false)} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer', 
                fontSize: '1.2rem', 
                padding: '0.3rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotate(0deg)';
              }}
            >
              <FaTimes />
            </button>
          </div>

          {/* Chat */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '1rem', 
            background: '#f8f8f8', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.6rem'
          }}>
            {conversacion.map((msg, i) => (
              <div 
                key={i} 
                style={{ 
                  maxWidth: '85%', 
                  alignSelf: msg.tipo === 'usuario' ? 'flex-end' : 'flex-start', 
                  background: msg.tipo === 'usuario' ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' : 'white', 
                  color: msg.tipo === 'usuario' ? 'white' : '#1a1a1a', 
                  padding: '0.8rem 1rem', 
                  borderRadius: msg.tipo === 'usuario' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)', 
                  fontSize: '0.95rem', 
                  lineHeight: '1.6', 
                  border: msg.tipo === 'bot' ? '1px solid #eee' : 'none',
                  animation: 'fadeInUp 0.3s ease'
                }}
              >
                {msg.texto}
              </div>
            ))}
            
            {cargando && (
              <div style={{ 
                alignSelf: 'flex-start', 
                background: 'white', 
                padding: '0.8rem 1rem', 
                borderRadius: '4px 16px 16px 16px', 
                border: '1px solid #eee', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                animation: 'fadeIn 0.3s ease'
              }}>
                <FaSpinner style={{ animation: 'spin 1s linear infinite', color: '#666' }} />
                <span style={{ color: '#888', fontSize: '0.9rem' }}>
                  {idioma === 'en' ? 'Thinking...' : 'Pensando...'}
                </span>
              </div>
            )}
            
            {/* Sugerencias */}
            {sugerencias.length > 0 && !cargando && conversacion.length <= 3 && (
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '0.5rem', 
                marginTop: '0.5rem'
              }}>
                {sugerencias.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => enviarMensaje(sug.replace(/^[^ ]+ /, ''))}
                    style={{
                      padding: '0.5rem 0.8rem',
                      background: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      color: '#555',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#1a1a1a';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = '#1a1a1a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.color = '#555';
                      e.currentTarget.style.borderColor = '#ddd';
                    }}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div style={{ 
            padding: '0.8rem 1rem', 
            borderTop: '1px solid #eee', 
            background: 'white', 
            display: 'flex', 
            gap: '0.6rem'
          }}>
            <input 
              ref={inputRef} 
              type="text" 
              value={mensaje} 
              onChange={(e) => setMensaje(e.target.value)} 
              onKeyPress={handleKeyPress} 
              placeholder={idioma === 'en' ? 'Type your question...' : 'Escribe tu pregunta...'} 
              style={{ 
                flex: 1, 
                padding: '0.7rem 1rem', 
                border: '1px solid #ddd', 
                borderRadius: '24px', 
                fontSize: '0.95rem', 
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1a1a1a';
                e.target.style.boxShadow = '0 0 0 3px rgba(26,26,26,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ddd';
                e.target.style.boxShadow = 'none';
              }}
              disabled={cargando} 
            />
            <button 
              onClick={() => enviarMensaje()} 
              disabled={!mensaje.trim() || cargando} 
              style={{ 
                background: (!mensaje.trim() || cargando) ? '#ccc' : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '50%', 
                width: '44px', 
                height: '44px', 
                cursor: (!mensaje.trim() || cargando) ? 'not-allowed' : 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!cargando && mensaje.trim()) {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FaPaperPlane />
            </button>
          </div>

          {/* Footer */}
          <div style={{ 
            padding: '0.4rem 1rem', 
            background: '#f8f8f8', 
            textAlign: 'center', 
            fontSize: '0.65rem', 
            color: '#bbb', 
            borderTop: '1px solid #eee'
          }}>
            {idioma === 'en' ? 'Prototipica Estudio · Virtual Assistant' : 'Prototipica Estudio · Asistente virtual'}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.9); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
