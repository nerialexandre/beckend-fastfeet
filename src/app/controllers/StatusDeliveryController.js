import * as Yup from 'yup';
import { Op } from 'sequelize';
import { startOfDay, endOfDay } from 'date-fns';
import Deliveries from '../models/Deliveries';
import Recipients from '../models/Recipients';
import Files from '../models/Files';

class StatusDeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const delivery = await Deliveries.findAll({
      where: {
        canceled_at: null,
        deliveryman_id: req.params.id,
        end_date: null,
      },
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
      ],
    });

    if (!delivery) {
      return res.json({ error: 'Nao existem Entregas' });
    }

    return res.json(delivery);
  }

  async update(req, res) {
    const { deliverymanId, deliveryId } = req.params;

    const schema = Yup.object().shape({
      start_date: Yup.boolean(),
      end_date: Yup.boolean(),
      signature_id: Yup.boolean(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Preencha corretamente' });
    }

    const delivery = await Deliveries.findByPk(deliveryId, {
      where: { deliveryman_id: deliverymanId, canceled_at: null },
    });

    if (!delivery) {
      return res.status(400).json({ error: 'entrega nao foi encontrada' });
    }

    const count = await Deliveries.findAndCountAll({
      where: {
        deliveryman_id: deliverymanId,
        start_date: {
          [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
        },
      },
    });

    const { start_date, end_date, signature_id } = req.body;

    if (start_date === true && delivery.alterable === false) {
      return res
        .status(400)
        .json({ error: 'Permitido retirar entregas apenas das 8h as 18h' });
    }

    if (start_date === true && count > 5) {
      return res
        .status(400)
        .json({ error: 'só é permitido 5 Retiradas por dia' });
    }

    if (start_date === true && delivery.start_date !== null) {
      return res.status(400).json({ error: 'Entrega ja iniciada' });
    }

    if (start_date === true && delivery.start_date === null) {
      const deliveryStart = await delivery.update({ start_date: new Date() });
      return res.json(deliveryStart);
    }

    const signature = await Files.findByPk(signature_id);
    if (!signature) {
      return res.status(400).json({ error: 'Assinatura nao localizada' });
    }

    if (
      (end_date === true && delivery.start_date === null) ||
      (end_date === true && delivery.end_date !== null) ||
      (end_date === true && delivery.signature_id !== null)
    ) {
      return res.status(400).json({ error: 'Entrega nao pode ser finalizada' });
    }

    if (
      end_date === true &&
      delivery.start_date !== null &&
      delivery.end_date === null
    ) {
      await delivery.update({
        end_date: new Date(),
        signature_id: signature.id,
      });
    }

    return res.json(delivery);
  }
}

export default new StatusDeliveryController();
