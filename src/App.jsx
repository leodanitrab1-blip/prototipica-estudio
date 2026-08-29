import { useState, useEffect } from 'react';
import MenuHamburguesa from './components/MenuHamburguesa';
import SeccionCentral from './components/SeccionCentral';
import Cotizar from './components/Cotizar';
import TiendaSoftware from './components/TiendaSoftware';
import Contacto from './components/Contacto';
import AsistenteIA from './components/AsistenteIA';
import { FiArrowUp, FiMail, FiMapPin } from 'react-icons/fi';

function App() {
  const [paginaActual, setPaginaActual] = useState('inicio');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [idioma, setIdioma] = useState('es');

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina === paginaActual) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setPaginaActual(nuevaPagina);
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textos = {
    es: {
      inicio: 'Inicio',
      cotizar: 'Cotizar',
      tienda: 'Tienda',
      contacto: 'Contacto',
      derechos: 'Todos los derechos reservados',
      hechoEn: 'Hecho en México',
      descripcion: 'Software y soluciones digitales para tu negocio. Innovación y calidad en cada proyecto.'
    },
    en: {
      inicio: 'Home',
      cotizar: 'Quote',
      tienda: 'Store',
      contacto: 'Contact',
      derechos: 'All rights reserved',
      hechoEn: 'Made in Mexico',
      descripcion: 'Software and digital solutions for your business. Innovation and quality in every project.'
    }
  };

  const t = textos[idioma];

  const renderPagina = () => {
    switch(paginaActual) {
      case 'inicio': return <SeccionCentral cambiarPagina={cambiarPagina} idioma={idioma} />;
      case 'cotizar': return <Cotizar idioma={idioma} />;
      case 'tienda': return <TiendaSoftware idioma={idioma} />;
      case 'contacto': return <Contacto idioma={idioma} />;
      default: return <SeccionCentral cambiarPagina={cambiarPagina} idioma={idioma} />;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
      position: 'relative'
    }}>
      <MenuHamburguesa 
        setPaginaActual={cambiarPagina} 
        paginaActual={paginaActual}
        idioma={idioma}
        setIdioma={setIdioma}
        textos={t}
      />

      <div 
        style={{ 
          paddingTop: '70px',
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {renderPagina()}
      </div>

      <AsistenteIA idioma={idioma} />

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            zIndex: 999
          }}
        >
          <FiArrowUp size={20} />
        </button>
      )}

      <footer style={{
        marginTop: '4rem',
        background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
        color: 'white',
        padding: '3rem 2rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, #c9a96e 50%, transparent 100%)'
        }} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          position: 'relative',
          zIndex: 1
        }}>
          <div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.5rem',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #c9a96e 0%, #e0c9a0 50%, #c9a96e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Prototipica Estudio
            </h3>
            <p style={{ color: '#999', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {t.descripcion}
            </p>
          </div>

          <div>
            <h4 style={{ 
              color: '#c9a96e', 
              marginBottom: '1rem',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              {idioma === 'es' ? 'Enlaces rápidos' : 'Quick Links'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {['inicio', 'cotizar', 'tienda', 'contacto'].map((pagina) => (
                <li key={pagina} style={{ marginBottom: '0.5rem' }}>
                  <button
                    onClick={() => cambiarPagina(pagina)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#999',
                      cursor: 'pointer',
                      padding: '0',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    {t[pagina]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ 
              color: '#c9a96e', 
              marginBottom: '1rem',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              {idioma === 'es' ? 'Contacto' : 'Contact'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#999' }}>
                <FiMail size={16} />
                <span style={{ fontSize: '0.9rem' }}>pdabasel1@gmail.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#999' }}>
                <FiMapPin size={16} />
                <span style={{ fontSize: '0.9rem' }}>México</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: '1200px',
          margin: '2rem auto 0',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>
            © {new Date().getFullYear()} Prototipica Estudio. {t.derechos}.
          </p>
          <p style={{ color: '#555', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            {t.hechoEn} 🇲🇽
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
