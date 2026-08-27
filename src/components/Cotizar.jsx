import { useState } from 'react';

export default function Cotizar() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    descripcion: '',
    presupuesto: '',
    tipoProyecto: 'web'
  });
  
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const tiposProyecto = [
    { value: 'web', label: '🌐 Sitio web' },
    { value: 'app', label: '📱 Aplicación móvil' },
    { value: 'software', label: '💻 Software de escritorio' },
    { value: 'api', label: '🔌 API / Backend' },
    { value: 'otro', label: '📦 Otro' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);

    // Validar campos obligatorios
    if (!form.nombre || !form.email || !form.descripcion) {
      setError('Por favor, completa los campos obligatorios (*)');
      setEnviando(false);
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Por favor, ingresa un correo electrónico válido');
      setEnviando(false);
      return;
    }

    try {
      // Enviar a la función serverless
      const response = await fetch('/api/enviar-correo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok) {
        setEnviado(true);
        setForm({
          nombre: '',
          email: '',
          telefono: '',
          descripcion: '',
          presupuesto: '',
          tipoProyecto: 'web'
        });
      } else {
        setError(data.error || 'Error al enviar la cotización. Intenta nuevamente.');
      }
    } catch (err) {
      setError('Error de conexión. Verifica tu internet e intenta de nuevo.');
      console.error('Error:', err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: '300', marginBottom: '0.5rem' }}>
        📋 Cotizar Servicio
      </h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Cuéntanos tu idea y te enviaremos un presupuesto personalizado a la brevedad.
      </p>

      {/* Mensaje de éxito */}
      {enviado && (
        <div style={{
          backgroundColor: '#f0f7f0',
          border: '1px solid #c8e6c9',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
          <h3 style={{ color: '#2e7d32', fontWeight: '500', marginBottom: '0.5rem' }}>
            ¡Cotización enviada!
          </h3>
          <p style={{ color: '#555' }}>
            Hemos recibido tu solicitud. Te contactaremos a la brevedad.
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
            Enviar otra cotización
          </button>
        </div>
      )}

      {/* Formulario */}
      {!enviado && (
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem'
        }}>
          {/* Error */}
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

          {/* Nombre */}
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

          {/* Email */}
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

          {/* Teléfono */}
          <div>
            <label htmlFor="telefono" style={{ fontWeight: '500' }}>
              Teléfono (opcional)
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="55 1234 5678"
            />
          </div>

          {/* Tipo de proyecto */}
          <div>
            <label htmlFor="tipoProyecto" style={{ fontWeight: '500' }}>
              Tipo de proyecto
            </label>
            <select
              id="tipoProyecto"
              name="tipoProyecto"
              value={form.tipoProyecto}
              onChange={handleChange}
            >
              {tiposProyecto.map(tipo => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" style={{ fontWeight: '500' }}>
              Descripción del proyecto <span style={{ color: '#c62828' }}>*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Describe tu idea, requerimientos, funcionalidades, etc."
              required
              rows="4"
            />
          </div>

          {/* Presupuesto */}
          <div>
            <label htmlFor="presupuesto" style={{ fontWeight: '500' }}>
              Presupuesto estimado (MXN) <span style={{ color: '#999', fontWeight: '400' }}>(opcional)</span>
            </label>
            <input
              type="number"
              id="presupuesto"
              name="presupuesto"
              value={form.presupuesto}
              onChange={handleChange}
              placeholder="Ej: 15000"
              min="0"
            />
          </div>

          {/* Botón enviar */}
          <button
            type="submit"
            disabled={enviando}
            style={{
              background: '#1a1a1a',
              color: 'white',
              padding: '1rem',
              border: 'none',
              borderRadius: '40px',
              fontSize: '1.1rem',
              fontWeight: '500',
              cursor: enviando ? 'not-allowed' : 'pointer',
              opacity: enviando ? 0.7 : 1,
              transition: 'all 0.3s ease',
              marginTop: '0.5rem',
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
              '📩 Enviar cotización'
            )}
          </button>

          <p style={{
            fontSize: '0.8rem',
            color: '#999',
            textAlign: 'center',
            marginTop: '0.5rem'
          }}>
            * Campos obligatorios. Tu información está segura con nosotros.
          </p>

          {/* Animación spin */}
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </form>
      )}
    </div>
  );
}