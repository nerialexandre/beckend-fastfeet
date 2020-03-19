import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Preencha o formulario' });
    }
    const deliveryman = await Deliveryman.create(req.body);
    return res.json(deliveryman);
  }

  async index(req, res) {
    const deliverymen = await Deliveryman.findAll({
      order: ['name'],
      attributes: ['id', 'name', 'avatar_id'],
    });
    if (!deliverymen) {
      return res.json({ mensage: 'Nao existem Entregadores cadastrados' });
    }

    return res.json(deliverymen);
  }

  async update(req, res) {
    const { id } = req.body;
    const deliveryman = await Deliveryman.findByPk(id);
    if (!deliveryman) {
      return res.json({ mensage: 'Entregador nao foi encontrado' });
    }
    const { name, email } = await deliveryman.update(req.body);

    return res.json({
      name,
      email,
    });
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.json({ mensage: 'Entregador nao foi encontrado' });
    }
    await deliveryman.destroy();

    return res.json();
  }
}

export default new DeliverymanController();
