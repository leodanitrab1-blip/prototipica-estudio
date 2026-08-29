import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaHome, FaFileInvoice, FaTools, FaEnvelope, FaChevronRight, FaGlobe } from 'react-icons/fa';

export default function MenuHamburguesa({ setPaginaActual, paginaActual, idioma, textos }) {
  const [abierto, setAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [abierto]);

  const navegar = (pagina) => {
    setPaginaActual(pagina);
    setAbierto(false);
  };

  const menuItems = [
    { id: 'inicio', icono: <FaHome />, label: textos?.inicio || 'Inicio', descripcion: 'Página principal' },
    { id: 'cotizar', icono: <FaFileInvoice />, label: textos?.cotizar || 'Cotizar servicios', descripcion: 'Solicita una cotización' },
    { id: 'tienda', icono: <FaTools />, label: textos?.tienda || 'MarketSoft', descripcion: 'Explora nuestro software' },
    { id: 'contacto', icono: <FaEnvelope />, label: textos?.contacto || 'Contacto', descripcion: 'Hablemos de tu proyecto' }
  ];

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: scrolled ? '0.6rem 1.5rem' : '0.8rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <button 
          onClick={() => navegar('inicio')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
          }}>
            <img 
              src="/logo.png" 
              alt="Prototipica" 
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }} 
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{
              fontWeight: '700',
              fontSize: '1.2rem',
              letterSpacing: '-0.5px',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
              fontFamily: "'Playfair Display', serif"
            }}>
              Prototipica
            </span>
            <span style={{
              fontSize: '0.65rem',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#999',
              display: 'block',
              fontWeight: '500'
            }}>
              Estudio
            </span>
          </div>
        </button>

        <button 
          onClick={() => setAbierto(!abierto)} 
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: abierto ? '#1a1a1a' : 'transparent',
            border: abierto ? 'none' : '1px solid rgba(0,0,0,0.1)',
            color: abierto ? 'white' : '#1a1a1a',
            fontSize: '1.3rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: abierto ? '0 4px 20px rgba(0,0,0,0.3)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (!abierto) {
              e.currentTarget.style.background = '#1a1a1a';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = '#1a1a1a';
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (!abierto) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#1a1a1a';
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          {abierto ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {abierto && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(5px)',
          zIndex: 1999,
          animation: 'fadeIn 0.3s ease',
          onClick: () => setAbierto(false)
        }} />
      )}

      <div style={{
        position: 'fixed',
        top: 0,
        right: abierto ? 0 : '-100%',
        width: '100%',
        maxWidth: '450px',
        height: '100vh',
        background: 'white',
        zIndex: 2000,
        transition: 'right 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: abierto ? '-10px 0 50px rgba(0,0,0,0.2)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.5rem',
              margin: 0,
              fontWeight: '700'
            }}>
              Menú
            </h2>
            <p style={{
              fontSize: '0.85rem',
              color: '#999',
              margin: '0.25rem 0 0 0'
            }}>
              Navega por nuestro sitio
            </p>
          </div>
          <button 
            onClick={() => setAbierto(false)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#f5f5f5',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              color: '#333',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1a1a1a';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f5f5f5';
              e.currentTarget.style.color = '#333';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
          >
            <FaTimes />
          </button>
        </div>

        <nav style={{
          flex: 1,
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          overflowY: 'auto'
        }}>
          {menuItems.map((item, index) => (
            <button 
              key={item.id} 
              onClick={() => navegar(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.2rem',
                width: '100%',
                padding: '1.2rem 1.5rem',
                fontSize: '1.1rem',
                fontWeight: paginaActual === item.id ? '600' : '400',
                color: paginaActual === item.id ? '#1a1a1a' : '#555',
                background: paginaActual === item.id 
                  ? 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)' 
                  : 'transparent',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredItem === item.id ? 'translateX(10px)' : 'translateX(0)',
                boxShadow: paginaActual === item.id ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
                animation: `slideIn 0.5s ease ${index * 0.1}s both`
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                background: paginaActual === item.id 
                  ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' 
                  : 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
                color: paginaActual === item.id ? '#c9a96e' : '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'all 0.3s ease',
                boxShadow: paginaActual === item.id ? '0 4px 15px rgba(0,0,0,0.2)' : 'none'
              }}>
                {item.icono}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '0.2rem'
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: '#999'
                }}>
                  {item.descripcion}
                </div>
              </div>

              <FaChevronRight style={{
                fontSize: '0.9rem',
                color: '#ccc',
                transition: 'all 0.3s ease',
                transform: hoveredItem === item.id ? 'translateX(5px)' : 'translateX(0)',
                opacity: hoveredItem === item.id ? 1 : 0.5
              }} />
            </button>
          ))}
        </nav>

        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaGlobe style={{ color: '#c9a96e', fontSize: '1rem' }} />
              <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '500' }}>
                {idioma === 'en' ? 'Language' : 'Idioma'}
              </span>
            </div>
            <span style={{
              padding: '0.3rem 0.8rem',
              background: '#1a1a1a',
              color: 'white',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              {idioma === 'en' ? 'EN' : 'ES'}
            </span>
          </div>
          <p style={{
            textAlign: 'center',
            color: '#999',
            fontSize: '0.8rem',
            margin: 0
          }}>
            © {new Date().getFullYear()} Prototipica Estudio
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
