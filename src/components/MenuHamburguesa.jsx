import { useState } from 'react';
import { FaBars, FaTimes, FaHome, FaFileInvoice, FaTools, FaEnvelope } from 'react-icons/fa';

export default function MenuHamburguesa({ setPaginaActual, paginaActual }) {
  const [abierto, setAbierto] = useState(false);

  const navegar = (pagina) => {
    setPaginaActual(pagina);
    setAbierto(false);
  };

  const menuItems = [
    { id: 'inicio', icono: <FaHome />, label: 'Inicio' },
    { id: 'cotizar', icono: <FaFileInvoice />, label: 'Cotizar servicios' },
    { id: 'tienda', icono: <FaTools />, label: 'MarketSoft' },
    { id: 'contacto', icono: <FaEnvelope />, label: 'Contacto' }
  ];

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        padding: '0.8rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <img src="/logo.png" alt="Prototipica" style={{ height: '36px' }} />
          <span style={{ fontWeight: '300', fontSize: '1.2rem', letterSpacing: '1px' }}>
            Prototipica
          </span>
        </div>
        <button onClick={() => setAbierto(!abierto)} style={{
          background: 'none',
          border: 'none',
          fontSize: '1.6rem',
          cursor: 'pointer',
          color: '#1a1a1a',
          padding: '0.4rem'
        }}>
          <FaBars />
        </button>
      </header>

      {abierto && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px)',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem'
        }}>
          <button onClick={() => setAbierto(false)} style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'none',
            border: 'none',
            fontSize: '2rem',
            cursor: 'pointer'
          }}>
            <FaTimes />
          </button>

          <nav style={{ width: '100%', maxWidth: '400px' }}>
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => navegar(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.2rem',
                  width: '100%',
                  padding: '1rem 1.5rem',
                  fontSize: '1.4rem',
                  fontWeight: paginaActual === item.id ? '500' : '300',
                  color: paginaActual === item.id ? '#1a1a1a' : '#555',
                  background: paginaActual === item.id ? 'rgba(0,0,0,0.04)' : 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>{item.icono}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <p style={{ position: 'absolute', bottom: '2rem', color: '#999', fontSize: '0.85rem' }}>
            pdabasel1@gmail.com
          </p>
        </div>
      )}
    </>
  );
}