import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const [, token] = authHeader.split(' ');

  try {
    const decoder = await promisify(jwt.verify)(token, authConfig.secret);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'token invalido' });
  }
};
