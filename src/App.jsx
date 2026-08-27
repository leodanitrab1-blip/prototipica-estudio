import MenuHamburguesa from './components/MenuHamburguesa';
import SeccionCentral from './components/SeccionCentral';
import Cotizar from './components/Cotizar';
import TiendaSoftware from './components/TiendaSoftware';
import Contacto from './components/Contacto';
import AsistenteIA from './components/AsistenteIA';

function App() {
  return (
    <div style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <MenuHamburguesa />
      
      <section id="inicio" style={{ paddingTop: '20px' }}>
        <SeccionCentral />
      </section>
      
      <section id="cotizar" style={{ scrollMarginTop: '80px', padding: '2rem 1.5rem' }}>
        <Cotizar />
      </section>
      
      <section id="tienda" style={{ scrollMarginTop: '80px', padding: '2rem 1.5rem' }}>
        <TiendaSoftware />
      </section>
      
      <section id="contacto" style={{ scrollMarginTop: '80px', padding: '2rem 1.5rem' }}>
        <Contacto />
      </section>
      
      <AsistenteIA />
      
      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem 1.5rem',
        borderTop: '1px solid #eee',
        color: '#888',
        fontSize: '0.9rem',
        backgroundColor: '#fafafa'
      }}>
        <p>© {new Date().getFullYear()} Prototipica Estudio · Desarrollo de software a medida</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
          Hecho con ❤️ desde México
        </p>
      </footer>
    </div>
  );
}

export default App;