import nodemailer from 'nodemailer';

const crearTransporter = () => {
  if (!process.env.TU_CORREO || !process.env.CONTRASENA_APP) {
    console.error('❌ Variables de entorno no configuradas');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.TU_CORREO,
      pass: process.env.CONTRASENA_APP
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const generarHtmlCorreo = (datos, tipo) => {
  const fecha = new Date().toLocaleString('es-MX', {
    dateStyle: 'full',
    timeStyle: 'short'
  });

  if (tipo === 'cotizacion') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 25px; border-radius: 0 0 8px 8px; border: 1px solid #ddd; border-top: none; }
          .campo { margin-bottom: 12px; }
          .campo-label { font-weight: bold; color: #555; }
          .campo-valor { margin-left: 8px; color: #1a1a1a; }
          .footer { margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📋 Nueva Cotización</h1>
          <p>Prototipica Estudio</p>
        </div>
        <div class="content">
          <p><strong>Fecha:</strong> ${fecha}</p>
          <hr>
          <div class="campo">
            <span class="campo-label">👤 Nombre:</span>
            <span class="campo-valor">${datos.nombre || 'No especificado'}</span>
          </div>
          <div class="campo">
            <span class="campo-label">📧 Email:</span>
            <span class="campo-valor">${datos.email || 'No especificado'}</span>
          </div>
          <div class="campo">
            <span class="campo-label">📱 Teléfono:</span>
            <span class="campo-valor">${datos.telefono || 'No especificado'}</span>
          </div>
          <div class="campo">
            <span class="campo-label">💰 Presupuesto:</span>
            <span class="campo-valor">${datos.presupuesto ? `$${Number(datos.presupuesto).toLocaleString('es-MX')} MXN` : 'No especificado'}</span>
          </div>
          <hr>
          <div class="campo">
            <span class="campo-label">📝 Descripción del proyecto:</span>
            <div style="background: white; padding: 12px; border-radius: 6px; margin-top: 6px; border: 1px solid #eee;">
              ${datos.descripcion || 'No especificada'}
            </div>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Prototipica Estudio</p>
          <p>Responder a: ${datos.email}</p>
        </div>
      </body>
      </html>
    `;
  }

  if (tipo === 'contacto') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 25px; border-radius: 0 0 8px 8px; border: 1px solid #ddd; border-top: none; }
          .campo { margin-bottom: 12px; }
          .campo-label { font-weight: bold; color: #555; }
          .campo-valor { margin-left: 8px; color: #1a1a1a; }
          .footer { margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📬 Nuevo Mensaje de Contacto</h1>
          <p>Prototipica Estudio</p>
        </div>
        <div class="content">
          <p><strong>Fecha:</strong> ${fecha}</p>
          <hr>
          <div class="campo">
            <span class="campo-label">👤 Nombre:</span>
            <span class="campo-valor">${datos.nombre || 'No especificado'}</span>
          </div>
          <div class="campo">
            <span class="campo-label">📧 Email:</span>
            <span class="campo-valor">${datos.email || 'No especificado'}</span>
          </div>
          <hr>
          <div class="campo">
            <span class="campo-label">💬 Mensaje:</span>
            <div style="background: white; padding: 12px; border-radius: 6px; margin-top: 6px; border: 1px solid #eee;">
              ${datos.mensaje || 'No especificado'}
            </div>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Prototipica Estudio</p>
          <p>Responder a: ${datos.email}</p>
        </div>
      </body>
      </html>
    `;
  }

  return `<h2>Nuevo mensaje</h2><pre>${JSON.stringify(datos, null, 2)}</pre>`;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const datos = req.body;

  if (!datos || !datos.email) {
    return res.status(400).json({ error: 'Falta el correo electrónico' });
  }

  if (!process.env.TU_CORREO) {
    return res.status(500).json({ error: 'Error de configuración del servidor' });
  }

  const transporter = crearTransporter();
  if (!transporter) {
    return res.status(500).json({ error: 'Error al configurar el servicio de correo' });
  }

  const tipo = datos.tipo || 'cotizacion';
  const asuntoMap = {
    cotizacion: '📋 Nueva Cotización - Prototipica Estudio',
    contacto: '📬 Nuevo Mensaje de Contacto - Prototipica Estudio'
  };
  const asunto = asuntoMap[tipo] || '📩 Nuevo Mensaje - Prototipica Estudio';

  const html = generarHtmlCorreo(datos, tipo);

  const mailOptions = {
    from: `"Prototipica Estudio" <${process.env.TU_CORREO}>`,
    to: process.env.TU_CORREO,
    replyTo: datos.email,
    subject: asunto,
    html: html,
    text: `Nuevo mensaje de ${datos.nombre || 'cliente'} (${datos.email})\n\n${datos.descripcion || datos.mensaje || ''}`
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
    return res.status(500).json({ error: 'Error al enviar el correo' });
  }
}