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

    const { count } = await Deliveries.findAndCountAll({
      where: {
        deliveryman_id: deliverymanId,
        start_date: {
          [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
        },
      },
    });
    console.log(count);

    const { start_date, end_date, signature_id } = req.body;

    if (start_date === true) {
      if (count > 5) {
        return res
          .status(400)
          .json({ error: 'só é permitido 5 Retiradas por dia' });
      }

      const deliveryStart = await Deliveries.findOne({
        where: {
          id: deliveryId,
          deliveryman_id: deliverymanId,
          canceled_at: null,
          start_date: null,
          end_date: null,
        },
      });

      if (!deliveryStart) {
        return res.status(400).json({ error: 'entrega nao foi encontrada' });
      }

      if (deliveryStart.alterable === false) {
        return res.status(400).json({ error: 'Retirar apenas de 8h as 18h' });
      }

      await deliveryStart.update({ start_date: new Date() });
      return res.json(deliveryStart);
    }

    if (end_date === true) {
      const signature = await Files.findByPk(signature_id);

      if (!signature) {
        return res.status(400).json({ error: 'Assinatura nao localizada' });
      }

      const deliveryEnd = await Deliveries.findOne({
        where: {
          id: deliveryId,
          deliveryman_id: deliverymanId,
          end_date: null,
          canceled_at: null,
          start_date: {
            [Op.ne]: null,
          },
        },
      });
      console.log(deliveryEnd);

      if (!deliveryEnd) {
        return res.status(400).json({ error: 'Entrega nao foi encontrada' });
      }

      await deliveryEnd.update({
        end_date: new Date(),
        signature_id: signature.id,
      });

      return res.json(deliveryEnd);
    }

    return res.json();
  }
}

export default new StatusDeliveryController();
