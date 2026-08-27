import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { productoId, nombre, precio, descripcion } = req.body;

    if (!nombre || !precio || precio <= 0) {
      return res.status(400).json({ error: 'Datos del producto inválidos' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: nombre,
              description: descripcion || 'Software de Prototipica Estudio',
            },
            unit_amount: Math.round(precio * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.SITE_URL || 'https://prototipica-estudio.onrender.com'}/tienda?success=true`,
      cancel_url: `${process.env.SITE_URL || 'https://prototipica-estudio.onrender.com'}/tienda?canceled=true`,
      metadata: {
        productoId: productoId.toString(),
      },
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error al crear sesión de pago:', error);
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
}