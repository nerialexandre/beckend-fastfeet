import * as Yup from 'yup';
import Deliveries from '../models/Deliveries';
import Deliverymen from '../models/Deliverymen';
import Recipients from '../models/Recipients';
import Files from '../models/Files';

import Queue from '../../lib/Queue';
import NewDeliveryMail from '../jobs/NewDeliveryMail';

class DeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number().required(),
      recipient_id: Yup.number().required(),
      product: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Preencha o formulario' });
    }

    const { deliveryman_id, recipient_id } = req.body;

    const CheckDeliveryman = await Deliverymen.findOne({
      where: {
        id: deliveryman_id,
      },
    });
    if (!CheckDeliveryman) {
      return res.status(401).json({ error: 'Entregador nao encontrado' });
    }

    const CheckRecipient = await Recipients.findOne({
      where: {
        id: recipient_id,
      },
    });
    if (!CheckRecipient) {
      return res.status(401).json({ error: 'Destinatario nao encontrado' });
    }

    const delivery = await Deliveries.create(req.body);

    const deliverymanEmail = await Deliveries.findByPk(delivery.id, {
      include: [
        {
          model: Deliverymen,
          as: 'Deliverymen',
          attributes: ['id', 'email', 'name'],
        },
        {
          model: Recipients,
          as: 'Recipients',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'cep',
          ],
        },
      ],
    });

    await Queue.add(NewDeliveryMail.key, {
      deliverymanEmail,
    });

    return res.json(delivery);
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const delivery = await Deliveries.findAll({
      where: { canceled_at: null },
      attributes: ['id', 'product', 'canceled_at'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: Recipients,
          as: 'Recipients',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'cep',
          ],
        },
        {
          model: Deliverymen,
          as: 'Deliverymen',
          attributes: ['id', 'name'],
          include: [
            {
              model: Files,
              as: 'Avatar',
            },
          ],
        },
      ],
    });
    if (!delivery) {
      return res.json({ error: 'Nao existem Entregas' });
    }

    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number(),
      recipient_id: Yup.number(),
      product: Yup.string(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Preencha corretamente' });
    }

    const delivery = await Deliveries.findByPk(req.params.id);

    if (!delivery) {
      return res.json({ error: 'entrega nao foi encontrada' });
    }
    const { deliveryman_id, recipient_id, product } = await delivery.update(
      req.body
    );

    return res.json({
      deliveryman_id,
      recipient_id,
      product,
    });
  }

  async delete(req, res) {
    const delivery = await Deliveries.findByPk(req.params.id);

    if (!delivery) {
      return res.json({ error: 'entrega nao foi encontrada' });
    }

    delivery.canceled_at = new Date();

    await delivery.save();

    return res.json({ message: 'Entrega foi cancelada' });
  }
}

export default new DeliveryController();
