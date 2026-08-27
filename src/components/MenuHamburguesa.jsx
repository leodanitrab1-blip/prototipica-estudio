import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaHome, FaFileInvoice, FaTools, FaEnvelope } from 'react-icons/fa';

export default function MenuHamburguesa() {
  const [abierto, setAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll para cambiar estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cerrarMenu = () => setAbierto(false);

  // Cerrar menú al presionar Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') cerrarMenu();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      {/* ===== HEADER FIJO ===== */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.98)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        padding: '0.8rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(0,0,0,0.04)',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.04)' : 'none'
      }}>
        {/* LOGO */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          cursor: 'pointer'
        }}>
          <img 
            src="/logo.png" 
            alt="Prototipica Estudio" 
            style={{ 
              height: '38px', 
              width: '38px',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span style={{
            fontWeight: '300',
            fontSize: '1.2rem',
            letterSpacing: '1.5px',
            color: '#1a1a1a'
          }}>
            Prototipica
          </span>
        </div>

        {/* BOTÓN HAMBURGUESA */}
        <button 
          onClick={() => setAbierto(!abierto)} 
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.6rem',
            cursor: 'pointer',
            color: '#1a1a1a',
            padding: '0.4rem 0.6rem',
            borderRadius: '8px',
            transition: 'background 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.04)'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
          aria-label="Abrir menú"
        >
          <FaBars />
        </button>
      </header>

      {/* ===== MENÚ DESPLEGABLE (FULL SCREEN) ===== */}
      {abierto && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(255, 255, 255, 0.97)',
          backdropFilter: 'blur(20px)',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          {/* BOTÓN CERRAR */}
          <button 
            onClick={cerrarMenu}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'none',
              border: 'none',
              fontSize: '2rem',
              cursor: 'pointer',
              color: '#1a1a1a',
              padding: '0.5rem',
              borderRadius: '50%',
              transition: 'background 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.05)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            aria-label="Cerrar menú"
          >
            <FaTimes />
          </button>

          {/* ENLACES DEL MENÚ */}
          <nav style={{ width: '100%', maxWidth: '400px' }}>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <li>
                <a 
                  href="#inicio" 
                  onClick={cerrarMenu}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.2rem',
                    padding: '1rem 1.5rem',
                    fontSize: '1.5rem',
                    fontWeight: '300',
                    color: '#1a1a1a',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(0,0,0,0.04)';
                    e.target.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                  }}
                >
                  <FaHome style={{ fontSize: '1.4rem', color: '#555' }} />
                  Inicio
                </a>
              </li>

              <li>
                <a 
                  href="#cotizar" 
                  onClick={cerrarMenu}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.2rem',
                    padding: '1rem 1.5rem',
                    fontSize: '1.5rem',
                    fontWeight: '300',
                    color: '#1a1a1a',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(0,0,0,0.04)';
                    e.target.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                  }}
                >
                  <FaFileInvoice style={{ fontSize: '1.4rem', color: '#555' }} />
                  Cotizar servicios
                </a>
              </li>

              <li>
                <a 
                  href="#tienda" 
                  onClick={cerrarMenu}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.2rem',
                    padding: '1rem 1.5rem',
                    fontSize: '1.5rem',
                    fontWeight: '300',
                    color: '#1a1a1a',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(0,0,0,0.04)';
                    e.target.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                  }}
                >
                  <FaTools style={{ fontSize: '1.4rem', color: '#555' }} />
                  Herramientas
                </a>
              </li>

              <li>
                <a 
                  href="#contacto" 
                  onClick={cerrarMenu}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.2rem',
                    padding: '1rem 1.5rem',
                    fontSize: '1.5rem',
                    fontWeight: '300',
                    color: '#1a1a1a',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(0,0,0,0.04)';
                    e.target.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                  }}
                >
                  <FaEnvelope style={{ fontSize: '1.4rem', color: '#555' }} />
                  Contacto
                </a>
              </li>
            </ul>
          </nav>

          {/* FOOTER DEL MENÚ */}
          <div style={{
            position: 'absolute',
            bottom: '2.5rem',
            textAlign: 'center',
            color: '#999',
            fontSize: '0.85rem',
            letterSpacing: '0.5px'
          }}>
            <p>© {new Date().getFullYear()} Prototipica Estudio</p>
            <p style={{ fontSize: '0.75rem', marginTop: '0.3rem', color: '#bbb' }}>
              Desarrollo de software a medida
            </p>
          </div>

          {/* ANIMACIÓN CSS INLINE */}
          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: scale(0.98);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}</style>
        </div>
      )}

      {/* ESPACIO PARA QUE EL CONTENIDO NO QUEDE DEBAJO DEL HEADER */}
      <div style={{ height: '70px' }}></div>
    </>
  );
}