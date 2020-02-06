import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const recipient = await Recipient.create(req.body);
    return res.json(recipient);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.string(),
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.string(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      cep: Yup.string(),
    });
    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Preencha o formulario' });
    }
    const { id } = req.body;

    const recipient = await Recipient.findByPk(id);
    const info = await recipient.update(req.body);

    res.json(info);
  }
}

export default new RecipientController();
