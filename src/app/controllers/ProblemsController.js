import * as Yup from 'yup';
import DeliveryProblems from '../models/DeliveryProblems';
import Deliveries from '../models/Deliveries';

import Recipients from '../models/Recipients';
import Deliverymen from '../models/Deliverymen';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class ProblemsController {
  async index(req, res) {
    const deliveries = await DeliveryProblems.findAll({
      attributes: ['id', 'description'],
      include: [
        {
          model: Deliveries,
          as: 'Deliveries',
        },
      ],
    });

    return res.json(deliveries);
  }

  async show(req, res) {
    const { id } = req.params;
    const deliveries = await DeliveryProblems.findAll({
      where: {
        delivery_id: id,
      },
      attributes: ['id', 'description'],
      include: [
        {
          model: Deliveries,
          as: 'Deliveries',
        },
      ],
    });

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Preencha o formulario' });
    }

    const { description } = req.body;
    const delivery_id = req.params.id;

    const deliveries = await Deliveries.findByPk(delivery_id);

    if (!deliveries) {
      return res.status(401).json({ message: 'Entrega nao localizada' });
    }

    const deliveryProblems = await DeliveryProblems.create({
      description,
      delivery_id,
    });

    return res.json(deliveryProblems);
  }

  async delete(req, res) {
    const { id } = req.params;
    const deliveryProblems = await DeliveryProblems.findByPk(id);

    if (!deliveryProblems) {
      return res.status(401).json({ message: 'Problema nao localizado' });
    }

    const delivery = await Deliveries.findByPk(deliveryProblems.delivery_id);

    if (!delivery) {
      return res.status(401).json({ message: 'Entrega nao localizada' });
    }

    await delivery.update({ canceled_at: new Date() });
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

    await Queue.add(CancellationMail.key, {
      deliverymanEmail,
    });
    return res.json(delivery);
  }
}

export default new ProblemsController();
