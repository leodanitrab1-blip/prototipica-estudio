import { useState } from 'react';

export default function Cotizar() {
  const [form, setForm] = useState({ 
    nombre: '', 
    email: '', 
    telefono: '', 
    descripcion: '', 
    presupuesto: '' 
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

    if (!form.nombre || !form.email || !form.descripcion) {
      setError('Completa los campos obligatorios (*)');
      setEnviando(false);
      return;
    }

    try {
      // ✅ Usamos la URL completa del backend
      const response = await fetch('https://prototipica-estudio.onrender.com/api/enviar-correo', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          ...form, 
          tipo: 'cotizacion' 
        })
      });

      if (response.ok) {
        setEnviado(true);
        setForm({ nombre: '', email: '', telefono: '', descripcion: '', presupuesto: '' });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al enviar. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error en cotización:', error);
      setError('Error de conexión. Revisa tu internet.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: '300', marginBottom: '0.5rem' }}>📋 Cotizar Servicio</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Cuéntanos tu idea y te enviaremos un presupuesto personalizado.
      </p>

      {enviado ? (
        <div style={{ background: '#f0f7f0', border: '1px solid #c8e6c9', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>✅</div>
          <h3 style={{ color: '#2e7d32' }}>¡Cotización enviada!</h3>
          <p style={{ color: '#555' }}>Te contactaremos a la brevedad.</p>
          <button 
            onClick={() => setEnviado(false)} 
            style={{
              marginTop: '1rem',
              background: 'transparent',
              border: '2px solid #2e7d32',
              color: '#2e7d32',
              padding: '0.5rem 1.5rem',
              borderRadius: '40px',
              cursor: 'pointer'
            }}
          >
            Enviar otra
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ 
              background: '#fff0f0', 
              border: '1px solid #ffcdd2', 
              padding: '0.8rem 1.2rem', 
              borderRadius: '8px', 
              color: '#c62828', 
              marginBottom: '1rem' 
            }}>
              ⚠️ {error}
            </div>
          )}
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.3rem' }}>Nombre *</label>
            <input 
              type="text" 
              name="nombre" 
              value={form.nombre} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.3rem' }}>Correo electrónico *</label>
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.3rem' }}>Teléfono (opcional)</label>
            <input 
              type="tel" 
              name="telefono" 
              value={form.telefono} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.3rem' }}>Descripción del proyecto *</label>
            <textarea 
              name="descripcion" 
              value={form.descripcion} 
              onChange={handleChange} 
              rows="4" 
              required 
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.3rem' }}>Presupuesto estimado (MXN) (opcional)</label>
            <input 
              type="number" 
              name="presupuesto" 
              value={form.presupuesto} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={enviando} 
            style={{
              width: '100%',
              background: '#1a1a1a',
              color: 'white',
              padding: '1rem',
              border: 'none',
              borderRadius: '40px',
              fontSize: '1rem',
              cursor: enviando ? 'not-allowed' : 'pointer',
              opacity: enviando ? 0.7 : 1
            }}
          >
            {enviando ? 'Enviando...' : '📩 Enviar cotización'}
          </button>
        </form>
      )}
    </div>
  );
}