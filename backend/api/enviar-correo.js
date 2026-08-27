// ========================================
// FUNCIÓN SERVERLESS PARA ENVÍO DE CORREOS
// ========================================
// Este archivo se ejecuta en el servidor (Render)
// Recibe las peticiones POST del frontend y envía correos usando Nodemailer

import nodemailer from 'nodemailer';

// Configuración del transporter de Nodemailer
const crearTransporter = () => {
  // Verificar que las variables de entorno estén configuradas
  if (!process.env.TU_CORREO || !process.env.CONTRASENA_APP) {
    console.error('❌ Variables de entorno no configuradas: TU_CORREO y CONTRASENA_APP son obligatorias');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.TU_CORREO,
      pass: process.env.CONTRASENA_APP
    },
    // Configuración adicional para mejor rendimiento
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Función para generar el HTML del correo según el tipo
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
          .badge { display: inline-block; background: #1a1a1a; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
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
            <span class="campo-label">📂 Tipo de proyecto:</span>
            <span class="campo-valor">${datos.tipoProyecto || 'No especificado'}</span>
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
          <br>
          <p style="text-align: center; color: #666; font-size: 14px;">
            <span class="badge">NUEVA COTIZACIÓN</span>
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Prototipica Estudio · Este mensaje fue enviado automáticamente</p>
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
          <div class="campo">
            <span class="campo-label">📝 Asunto:</span>
            <span class="campo-valor">${datos.asunto || 'Sin asunto'}</span>
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
          <p>© ${new Date().getFullYear()} Prototipica Estudio · Este mensaje fue enviado automáticamente</p>
          <p>Responder a: ${datos.email}</p>
        </div>
      </body>
      </html>
    `;
  }

  // Fallback
  return `
    <h2>Nuevo mensaje de Prototipica Estudio</h2>
    <pre>${JSON.stringify(datos, null, 2)}</pre>
  `;
};

// ========================================
// FUNCIÓN PRINCIPAL (HANDLER)
// ========================================
export default async function handler(req, res) {
  // 1. Verificar método
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Método no permitido. Usa POST.' 
    });
  }

  // 2. Obtener datos del cuerpo de la petición
  const datos = req.body;

  // 3. Validar datos mínimos
  if (!datos || !datos.email) {
    return res.status(400).json({ 
      error: 'Falta el correo electrónico del remitente' 
    });
  }

  // 4. Verificar variables de entorno
  if (!process.env.TU_CORREO) {
    console.error('❌ TU_CORREO no está configurado en variables de entorno');
    return res.status(500).json({ 
      error: 'Error de configuración del servidor' 
    });
  }

  // 5. Crear transporter
  const transporter = crearTransporter();
  if (!transporter) {
    return res.status(500).json({ 
      error: 'Error al configurar el servicio de correo. Verifica tus credenciales.' 
    });
  }

  // 6. Determinar el tipo de mensaje
  const tipo = datos.tipo || 'cotizacion';
  const asuntoMap = {
    cotizacion: '📋 Nueva Cotización - Prototipica Estudio',
    contacto: '📬 Nuevo Mensaje de Contacto - Prototipica Estudio'
  };
  const asunto = asuntoMap[tipo] || '📩 Nuevo Mensaje - Prototipica Estudio';

  // 7. Generar HTML del correo
  const html = generarHtmlCorreo(datos, tipo);

  // 8. Configurar opciones del correo
  const mailOptions = {
    from: `"Prototipica Estudio" <${process.env.TU_CORREO}>`,
    to: process.env.TU_CORREO, // El correo te llega a ti
    replyTo: datos.email, // Para que puedas responder directamente al cliente
    subject: asunto,
    html: html,
    // Texto plano como fallback
    text: `Nuevo mensaje de ${datos.nombre || 'cliente'} (${datos.email})\n\n${datos.descripcion || datos.mensaje || ''}`
  };

  try {
    // 9. Enviar el correo
    console.log(`📧 Enviando correo a ${process.env.TU_CORREO}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Correo enviado:', info.messageId);

    // 10. Respuesta exitosa
    return res.status(200).json({
      success: true,
      message: 'Correo enviado correctamente',
      messageId: info.messageId
    });
  } catch (error) {
    // 11. Manejo de errores
    console.error('❌ Error al enviar correo:', error);
    return res.status(500).json({
      error: 'Error al enviar el correo. Intenta nuevamente.',
      details: error.message
    });
  }
}