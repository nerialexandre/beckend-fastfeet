import * as Yup from 'yup';
import Recipients from '../models/Recipients';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Preencha o formulario' });
    }
    const recipient = await Recipients.create(req.body);
    return res.json(recipient);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.string().required(),
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.string(),
      complement: Yup.string(),
      state: Yup.string(2)
        .min(2)
        .max(2),
      city: Yup.string(),
      cep: Yup.string(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Preencha o formulario' });
    }
    const { id } = req.body;

    const recipient = await Recipients.findByPk(id);
    if (!recipient) {
      res.status(400).json({ error: 'Destinatario nao encontrado' });
    }
    const newRecipient = await recipient.update(req.body);

    return res.json(newRecipient);
  }
}

export default new RecipientController();
