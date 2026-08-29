import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaHome, FaFileInvoice, FaTools, FaEnvelope, FaChevronRight } from 'react-icons/fa';

export default function MenuHamburguesa({ setPaginaActual, paginaActual, idioma, setIdioma, textos }) {
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
    { id: 'inicio', icono: <FaHome />, label: textos?.inicio || 'Inicio', descripcion: idioma === 'en' ? 'Home page' : 'Página principal' },
    { id: 'cotizar', icono: <FaFileInvoice />, label: textos?.cotizar || 'Cotizar servicios', descripcion: idioma === 'en' ? 'Request a quote' : 'Solicita una cotización' },
    { id: 'tienda', icono: <FaTools />, label: textos?.tienda || 'MarketSoft', descripcion: idioma === 'en' ? 'Explore our software' : 'Explora nuestro software' },
    { id: 'contacto', icono: <FaEnvelope />, label: textos?.contacto || 'Contacto', descripcion: idioma === 'en' ? 'Talk about your project' : 'Hablemos de tu proyecto' }
  ];

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: scrolled ? '0.6rem 1rem' : '0.8rem 1rem',
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
            gap: '0.6rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <img 
            src="/logo.png" 
            alt="Prototipica Estudio" 
            style={{ 
              height: '40px',
              width: 'auto',
              display: 'block'
            }}
          />
          <div style={{ textAlign: 'left' }}>
            <span style={{
              fontWeight: '700',
              fontSize: '1.1rem',
              letterSpacing: '-0.5px',
              display: 'block',
              fontFamily: "'Playfair Display', serif",
              color: '#1a1a1a'
            }}>
              Prototipica
            </span>
            <span style={{
              fontSize: '0.6rem',
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

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            display: 'flex',
            gap: '4px',
            background: '#f5f5f5',
            borderRadius: '20px',
            padding: '3px'
          }}>
            <button
              onClick={() => setIdioma && setIdioma('es')}
              style={{
                padding: '5px 10px',
                border: 'none',
                background: idioma === 'es' ? '#1a1a1a' : 'transparent',
                color: idioma === 'es' ? 'white' : '#666',
                borderRadius: '16px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              ES
            </button>
            <button
              onClick={() => setIdioma && setIdioma('en')}
              style={{
                padding: '5px 10px',
                border: 'none',
                background: idioma === 'en' ? '#1a1a1a' : 'transparent',
                color: idioma === 'en' ? 'white' : '#666',
                borderRadius: '16px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              EN
            </button>
          </div>

          <button 
            onClick={() => setAbierto(!abierto)} 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: abierto ? '#1a1a1a' : 'transparent',
              border: abierto ? 'none' : '1px solid rgba(0,0,0,0.1)',
              color: abierto ? 'white' : '#1a1a1a',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            {abierto ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>

      {abierto && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          zIndex: 1999,
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
              {idioma === 'en' ? 'Menu' : 'Menú'}
            </h2>
            <p style={{
              fontSize: '0.85rem',
              color: '#999',
              margin: '0.25rem 0 0 0'
            }}>
              {idioma === 'en' ? 'Navigate our site' : 'Navega por nuestro sitio'}
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
                gap: '1rem',
                width: '100%',
                padding: '1rem 1.2rem',
                fontSize: '1rem',
                fontWeight: paginaActual === item.id ? '600' : '400',
                color: paginaActual === item.id ? '#1a1a1a' : '#555',
                background: paginaActual === item.id 
                  ? 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)' 
                  : 'transparent',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                transform: hoveredItem === item.id ? 'translateX(5px)' : 'translateX(0)'
              }}
            >
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '12px',
                background: paginaActual === item.id 
                  ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' 
                  : '#f5f5f5',
                color: paginaActual === item.id ? '#c9a96e' : '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem'
              }}>
                {item.icono}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', marginBottom: '0.2rem' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#999' }}>
                  {item.descripcion}
                </div>
              </div>
              <FaChevronRight style={{ fontSize: '0.8rem', color: '#ccc' }} />
            </button>
          ))}
        </nav>

        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          textAlign: 'center'
        }}>
          <p style={{ color: '#999', fontSize: '0.8rem', margin: 0 }}>
            © {new Date().getFullYear()} Prototipica Estudio
          </p>
        </div>
      </div>
    </>
  );
}
