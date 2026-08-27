import { useState } from 'react';
import MenuHamburguesa from './components/MenuHamburguesa';
import SeccionCentral from './components/SeccionCentral';
import Cotizar from './components/Cotizar';
import TiendaSoftware from './components/TiendaSoftware';
import Contacto from './components/Contacto';
import AsistenteIA from './components/AsistenteIA';

function App() {
  const [paginaActual, setPaginaActual] = useState('inicio');

  const renderPagina = () => {
    switch(paginaActual) {
      case 'inicio': return <SeccionCentral />;
      case 'cotizar': return <Cotizar />;
      case 'tienda': return <TiendaSoftware />;
      case 'contacto': return <Contacto />;
      default: return <SeccionCentral />;
    }
  };

  return (
    <div>
      <MenuHamburguesa setPaginaActual={setPaginaActual} paginaActual={paginaActual} />
      <div style={{ paddingTop: '80px' }}>{renderPagina()}</div>
      <AsistenteIA />
      <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid #eee', color: '#999', fontSize: '0.9rem' }}>
        <p>© {new Date().getFullYear()} Prototipica Estudio</p>
        <p style={{ fontSize: '0.8rem' }}>pdabasel1@gmail.com</p>
      </footer>
    </div>
  );
}

export default App;