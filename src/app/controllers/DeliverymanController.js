import * as Yup from 'yup';
import Deliverymen from '../models/Deliverymen';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Preencha o formulario' });
    }
    const CheckDeliveryman = await Deliverymen.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (CheckDeliveryman) {
      return res.status(401).json({ message: 'Entregador já cadastrado' });
    }
    const deliveryman = await Deliverymen.create(req.body);
    return res.json(deliveryman);
  }

  async index(req, res) {
    const deliverymen = await Deliverymen.findAll({
      order: ['name'],
      attributes: ['id', 'name', 'avatar_id'],
    });
    if (!deliverymen) {
      return res.json({ mensage: 'Nao existem Entregadores cadastrados' });
    }

    return res.json(deliverymen);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Preencha o id' });
    }

    const deliveryman = await Deliverymen.findByPk(req.params.id);
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
    const deliveryman = await Deliverymen.findByPk(req.params.id);

    if (!deliveryman) {
      return res.json({ mensage: 'Entregador nao foi encontrado' });
    }
    await deliveryman.destroy();

    return res.json();
  }
}

export default new DeliverymanController();
