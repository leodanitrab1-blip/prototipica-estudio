import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);

    // Validar campos
    if (!form.nombre || !form.email || !form.mensaje) {
      setError('Por favor, completa los campos obligatorios (*)');
      setEnviando(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Por favor, ingresa un correo electrónico válido');
      setEnviando(false);
      return;
    }

    try {
      const response = await fetch('/api/enviar-correo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          tipo: 'contacto'
        })
      });

      if (response.ok) {
        setEnviado(true);
        setForm({
          nombre: '',
          email: '',
          asunto: '',
          mensaje: ''
        });
      } else {
        setError('Error al enviar el mensaje. Intenta nuevamente.');
      }
    } catch (err) {
      setError('Error de conexión. Verifica tu internet e intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  // Información de contacto
  const contactInfo = [
    {
      icon: <FaEnvelope size={24} />,
      title: 'Correo electrónico',
      detail: 'contacto@prototipica.com',
      link: 'mailto:contacto@prototipica.com'
    },
    {
      icon: <FaPhone size={24} />,
      title: 'Teléfono',
      detail: '+52 55 1234 5678',
      link: 'tel:+525512345678'
    },
    {
      icon: <FaWhatsapp size={24} />,
      title: 'WhatsApp',
      detail: '+52 55 1234 5678',
      link: 'https://api.whatsapp.com/send?phone=525512345678'
    },
    {
      icon: <FaMapMarkerAlt size={24} />,
      title: 'Ubicación',
      detail: 'Ciudad de México, México',
      link: '#'
    }
  ];

  // Redes sociales
  const socialLinks = [
    { icon: <FaFacebook size={22} />, name: 'Facebook', url: '#' },
    { icon: <FaTwitter size={22} />, name: 'Twitter', url: '#' },
    { icon: <FaInstagram size={22} />, name: 'Instagram', url: '#' },
    { icon: <FaLinkedin size={22} />, name: 'LinkedIn', url: '#' }
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: '300', marginBottom: '0.5rem' }}>
        📬 Contacto
      </h2>
      <p style={{ color: '#666', marginBottom: '2.5rem' }}>
        ¿Tienes alguna pregunta? Contáctanos y te responderemos a la brevedad.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {contactInfo.map((item, index) => (
          <a
            key={index}
            href={item.link}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.2rem',
              border: '1px solid #eee',
              borderRadius: '12px',
              textDecoration: 'none',
              color: '#1a1a1a',
              transition: 'all 0.3s ease',
              backgroundColor: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#f5f5f5',
              color: '#1a1a1a',
              flexShrink: 0
            }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#999', fontWeight: '500' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '400' }}>
                {item.detail}
              </div>
            </div>
          </a>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        alignItems: 'start'
      }}>
        {/* Formulario de contacto */}
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '500', marginBottom: '1.5rem' }}>
            Envíanos un mensaje
          </h3>

          {enviado ? (
            <div style={{
              backgroundColor: '#f0f7f0',
              border: '1px solid #c8e6c9',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
              <h3 style={{ color: '#2e7d32', fontWeight: '500', marginBottom: '0.5rem' }}>
                ¡Mensaje enviado!
              </h3>
              <p style={{ color: '#555' }}>
                Gracias por contactarnos. Te responderemos lo antes posible.
              </p>
              <button
                onClick={() => setEnviado(false)}
                style={{
                  marginTop: '1rem',
                  background: 'transparent',
                  border: '2px solid #2e7d32',
                  color: '#2e7d32',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '40px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#2e7d32';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#2e7d32';
                }}
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem'
            }}>
              {error && (
                <div style={{
                  backgroundColor: '#fff0f0',
                  border: '1px solid #ffcdd2',
                  borderRadius: '8px',
                  padding: '0.8rem 1.2rem',
                  color: '#c62828',
                  fontSize: '0.95rem'
                }}>
                  ⚠️ {error}
                </div>
              )}

              <div>
                <label htmlFor="nombre" style={{ fontWeight: '500' }}>
                  Nombre completo <span style={{ color: '#c62828' }}>*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" style={{ fontWeight: '500' }}>
                  Correo electrónico <span style={{ color: '#c62828' }}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="asunto" style={{ fontWeight: '500' }}>
                  Asunto
                </label>
                <input
                  type="text"
                  id="asunto"
                  name="asunto"
                  value={form.asunto}
                  onChange={handleChange}
                  placeholder="¿De qué trata tu mensaje?"
                />
              </div>

              <div>
                <label htmlFor="mensaje" style={{ fontWeight: '500' }}>
                  Mensaje <span style={{ color: '#c62828' }}>*</span>
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  placeholder="Escribe tu mensaje aquí..."
                  rows="5"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={enviando}
                style={{
                  background: '#1a1a1a',
                  color: 'white',
                  padding: '1rem',
                  border: 'none',
                  borderRadius: '40px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: enviando ? 'not-allowed' : 'pointer',
                  opacity: enviando ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  if (!enviando) e.target.style.background = '#333';
                }}
                onMouseLeave={(e) => {
                  if (!enviando) e.target.style.background = '#1a1a1a';
                }}
              >
                {enviando ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '20px',
                      height: '20px',
                      border: '3px solid rgba(255,255,255,0.3)',
                      borderTop: '3px solid white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    Enviando...
                  </span>
                ) : (
                  '📩 Enviar mensaje'
                )}
              </button>

              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </form>
          )}
        </div>

        {/* Información adicional y redes sociales */}
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '500', marginBottom: '1.5rem' }}>
            Conéctate con nosotros
          </h3>
          
          <p style={{ color: '#666', marginBottom: '2rem', lineHeight: '1.8' }}>
            Síguenos en redes sociales para estar al día con nuestros proyectos, 
            novedades y ofertas especiales.
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '2.5rem'
          }}>
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#f5f5f5',
                  color: '#1a1a1a',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1a1a1a';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                  e.currentTarget.style.color = '#1a1a1a';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>

          <div style={{
            border: '1px solid #eee',
            borderRadius: '12px',
            padding: '1.5rem',
            backgroundColor: '#fafafa'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Horario de atención
            </h4>
            <div style={{ color: '#666', lineHeight: '2' }}>
              <div>Lunes a Viernes: 9:00 - 18:00</div>
              <div>Sábado: 10:00 - 14:00</div>
              <div style={{ color: '#999' }}>Domingo: Cerrado</div>
            </div>
            <div style={{
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #eee',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '0.8rem', color: '#999' }}>
                ⏰ Tiempo de respuesta promedio: 24 hrs
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}