import express from 'express';
import dotenv from 'dotenv';
import { Pelicula } from './db.js';
import { login, verificarToken } from './auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// LOGIN — pública
app.post('/login', login);

// GET — protegida
app.get('/peliculas', verificarToken, async (req, res) => {
  try {
    const { subgenero, es_culto } = req.query;
    const where = {};

    if (subgenero) where.subgenero = subgenero;
    if (es_culto !== undefined) where.es_culto = Number(es_culto);

    const peliculas = await Pelicula.findAll({
      where,
      order: [['calificacion', 'DESC']]
    });

    res.json({ total: peliculas.length, peliculas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST — protegida
app.post('/peliculas', verificarToken, async (req, res) => {
  try {
    const { titulo, director, anio, subgenero, sinopsis, calificacion, pais, es_culto } = req.body;

    if (!titulo || !director || !anio || !subgenero || !calificacion || !pais) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const pelicula = await Pelicula.create({
      titulo, director, anio, subgenero, sinopsis, calificacion, pais, es_culto: es_culto ?? 0
    });

    res.status(201).json({ mensaje: 'Película creada exitosamente', id: pelicula.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT — protegida
app.put('/peliculas/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, director, anio, subgenero, sinopsis, calificacion, pais, es_culto } = req.body;

    if (!titulo || !director || !anio || !subgenero || !calificacion || !pais) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const pelicula = await Pelicula.findByPk(id);
    if (!pelicula) return res.status(404).json({ error: 'Película no encontrada' });

    await pelicula.update({
      titulo, director, anio, subgenero, sinopsis, calificacion, pais, es_culto: es_culto ?? 0
    });

    res.json({ mensaje: 'Película actualizada exitosamente', id: Number(id) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE — protegida
app.delete('/peliculas/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    const pelicula = await Pelicula.findByPk(id);
    if (!pelicula) return res.status(404).json({ error: 'Película no encontrada' });

    await pelicula.destroy();
    res.json({ mensaje: 'Película eliminada exitosamente', id: Number(id) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});