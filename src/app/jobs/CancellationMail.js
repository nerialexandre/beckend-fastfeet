import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { deliverymanEmail } = data;
    console.log('a fila executou');

    await Mail.sendMail({
      to: `${deliverymanEmail.Deliverymen.name} <${deliverymanEmail.Deliverymen.email}>`,
      subject: 'Entrega Cancelada',
      template: 'cancellation',
      context: {
        product: deliverymanEmail.product,
        recipient: deliverymanEmail.Recipients.name,
        deliveryman: deliverymanEmail.Deliverymen.name,
        street: deliverymanEmail.Recipients.street,
        number: deliverymanEmail.Recipients.number,
        complement: deliverymanEmail.Recipients.complement,
        state: deliverymanEmail.Recipients.state,
        city: deliverymanEmail.Recipients.city,
        cep: deliverymanEmail.Recipients.cep,
      },
    });
  }
}
export default new CancellationMail();
