// ========================================
// SERVICIO DE CORREO PARA COTIZACIONES
// ========================================
// Este archivo contiene las funciones para enviar correos
// usando la API de Nodemailer a través de funciones serverless

/**
 * Envía un correo electrónico con la cotización del cliente
 * @param {Object} datos - Datos del formulario de cotización
 * @param {string} datos.nombre - Nombre del cliente
 * @param {string} datos.email - Email del cliente
 * @param {string} datos.telefono - Teléfono del cliente (opcional)
 * @param {string} datos.descripcion - Descripción del proyecto
 * @param {string} datos.presupuesto - Presupuesto estimado (opcional)
 * @param {string} datos.tipoProyecto - Tipo de proyecto seleccionado
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const enviarCotizacion = async (datos) => {
  try {
    const response = await fetch('/api/enviar-correo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...datos,
        tipo: 'cotizacion'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al enviar la cotización');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en emailService:', error);
    throw error;
  }
};

/**
 * Envía un correo electrónico con el mensaje de contacto
 * @param {Object} datos - Datos del formulario de contacto
 * @param {string} datos.nombre - Nombre del contacto
 * @param {string} datos.email - Email del contacto
 * @param {string} datos.asunto - Asunto del mensaje (opcional)
 * @param {string} datos.mensaje - Mensaje del contacto
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const enviarContacto = async (datos) => {
  try {
    const response = await fetch('/api/enviar-correo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...datos,
        tipo: 'contacto'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al enviar el mensaje');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en emailService:', error);
    throw error;
  }
};

/**
 * Valida el formato de un correo electrónico
 * @param {string} email - Correo a validar
 * @returns {boolean} - true si es válido, false si no
 */
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida que un campo no esté vacío
 * @param {string} valor - Valor a validar
 * @returns {boolean} - true si no está vacío, false si está vacío
 */
export const validarCampo = (valor) => {
  return valor && valor.trim().length > 0;
};

/**
 * Limpia un texto de caracteres especiales para evitar inyección
 * @param {string} texto - Texto a limpiar
 * @returns {string} - Texto limpiado
 */
export const limpiarTexto = (texto) => {
  if (!texto) return '';
  return texto
    .replace(/[<>]/g, '') // Elimina < y >
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
};

/**
 * Formatea un presupuesto a moneda MXN
 * @param {number|string} monto - Monto a formatear
 * @returns {string} - Monto formateado en pesos mexicanos
 */
export const formatearPrecio = (monto) => {
  const numero = typeof monto === 'string' ? parseFloat(monto) : monto;
  if (isNaN(numero) || numero === 0) return '$0 MXN';
  return `$${numero.toLocaleString('es-MX')} MXN`;
};

/**
 * Genera un mensaje de confirmación para el cliente
 * @param {string} nombre - Nombre del cliente
 * @param {string} tipo - Tipo de mensaje (cotizacion o contacto)
 * @returns {string} - Mensaje de confirmación
 */
export const generarMensajeConfirmacion = (nombre, tipo = 'cotizacion') => {
  const mensajes = {
    cotizacion: `Hola ${nombre}, hemos recibido tu solicitud de cotización. En las próximas 24-48 horas recibirás una respuesta personalizada.`,
    contacto: `Hola ${nombre}, gracias por contactarnos. Te responderemos a la brevedad posible.`
  };
  return mensajes[tipo] || mensajes.cotizacion;
};

export default {
  enviarCotizacion,
  enviarContacto,
  validarEmail,
  validarCampo,
  limpiarTexto,
  formatearPrecio,
  generarMensajeConfirmacion
};