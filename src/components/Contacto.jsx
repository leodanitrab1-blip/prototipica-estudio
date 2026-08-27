import { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
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

    if (!form.nombre || !form.email || !form.mensaje) {
      setError('Completa todos los campos');
      setEnviando(false);
      return;
    }

    try {
      const response = await fetch('https://prototipica-estudio-backend.onrender.com/api/enviar-correo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tipo: 'contacto' })
      });

      if (response.ok) {
        setEnviado(true);
        setForm({ nombre: '', email: '', mensaje: '' });
      } else {
        setError('Error al enviar. Intenta nuevamente.');
      }
    } catch {
      setError('Error de conexión.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: '300', marginBottom: '0.5rem' }}>📬 Contacto</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>¿Tienes alguna pregunta? Contáctanos.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '12px', textAlign: 'center' }}>
          <FaEnvelope size={24} style={{ color: '#1a1a1a' }} />
          <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.3rem' }}>Correo</p>
          <p style={{ fontWeight: '500' }}>pdabasel1@gmail.com</p>
        </div>
      </div>

      {enviado ? (
        <div style={{ background: '#f0f7f0', border: '1px solid #c8e6c9', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>✅</div>
          <h3 style={{ color: '#2e7d32' }}>¡Mensaje enviado!</h3>
          <p style={{ color: '#555' }}>Te responderemos lo antes posible.</p>
          <button onClick={() => setEnviado(false)} style={{ marginTop: '1rem', background: 'transparent', border: '2px solid #2e7d32', color: '#2e7d32', padding: '0.5rem 1.5rem', borderRadius: '40px', cursor: 'pointer' }}>Enviar otro</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div style={{ background: '#fff0f0', border: '1px solid #ffcdd2', padding: '0.8rem', borderRadius: '8px', color: '#c62828', marginBottom: '1rem' }}>⚠️ {error}</div>}
          <div style={{ marginBottom: '1rem' }}><label style={{ fontWeight: '500', display: 'block', marginBottom: '0.3rem' }}>Nombre *</label><input type="text" name="nombre" value={form.nombre} onChange={handleChange} required /></div>
          <div style={{ marginBottom: '1rem' }}><label style={{ fontWeight: '500', display: 'block', marginBottom: '0.3rem' }}>Correo electrónico *</label><input type="email" name="email" value={form.email} onChange={handleChange} required /></div>
          <div style={{ marginBottom: '1.5rem' }}><label style={{ fontWeight: '500', display: 'block', marginBottom: '0.3rem' }}>Mensaje *</label><textarea name="mensaje" value={form.mensaje} onChange={handleChange} rows="4" required /></div>
          <button type="submit" disabled={enviando} style={{ width: '100%', background: '#1a1a1a', color: 'white', padding: '1rem', border: 'none', borderRadius: '40px', fontSize: '1rem', cursor: enviando ? 'not-allowed' : 'pointer', opacity: enviando ? 0.7 : 1 }}>{enviando ? 'Enviando...' : '📩 Enviar mensaje'}</button>
        </form>
      )}
    </div>
  );
}