import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET || 'clave_secreta_123';

const usuarios = [
  { id: 1, usuario: 'admin', password: '1234' }
];

export function login(req, res) {
  const { usuario, password } = req.body;

  const user = usuarios.find(u => u.usuario === usuario && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  }

  const token = jwt.sign(
    { id: user.id, usuario: user.usuario },
    SECRET,
    { expiresIn: '1h' }
  );

  res.json({ mensaje: 'Login exitoso', token });
}

export function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
    req.usuario = decoded;
    next();
  });
}