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

  // async index(req, res) {
  //   return res.json();
  // }

  // async update(req, res) {
  //   return res.json();
  // }

  // async delete(req, res) {
  //   return res.json();
  // }
}

export default new DeliverymanController();
