import express from 'express';
import db from './db.js';
import { login, verificarToken } from './auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// LOGIN — pública
app.post('/login', login);

// GET — protegida
app.get('/peliculas', verificarToken, (req, res) => {
  const { subgenero, es_culto } = req.query;

  let sql = 'SELECT * FROM peliculas';
  const params = [];
  const condiciones = [];

  if (subgenero) {
    condiciones.push('subgenero = ?');
    params.push(subgenero);
  }

  if (es_culto !== undefined) {
    condiciones.push('es_culto = ?');
    params.push(Number(es_culto));
  }

  if (condiciones.length > 0) {
    sql += ' WHERE ' + condiciones.join(' AND ');
  }

  sql += ' ORDER BY calificacion DESC';

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ total: rows.length, peliculas: rows });
  });
});

// POST — protegida
app.post('/peliculas', verificarToken, (req, res) => {
  const { titulo, director, anio, subgenero, sinopsis, calificacion, pais, es_culto } = req.body;

  if (!titulo || !director || !anio || !subgenero || !calificacion || !pais) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const sql = `
    INSERT INTO peliculas (titulo, director, anio, subgenero, sinopsis, calificacion, pais, es_culto)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [titulo, director, anio, subgenero, sinopsis, calificacion, pais, es_culto ?? 0], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ mensaje: 'Película creada exitosamente', id: this.lastID });
  });
});

// PUT — protegida
app.put('/peliculas/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const { titulo, director, anio, subgenero, sinopsis, calificacion, pais, es_culto } = req.body;

  if (!titulo || !director || !anio || !subgenero || !calificacion || !pais) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const sql = `
    UPDATE peliculas
    SET titulo = ?, director = ?, anio = ?, subgenero = ?,
        sinopsis = ?, calificacion = ?, pais = ?, es_culto = ?
    WHERE id = ?
  `;

  db.run(sql, [titulo, director, anio, subgenero, sinopsis, calificacion, pais, es_culto ?? 0, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Película no encontrada' });
    res.json({ mensaje: 'Película actualizada exitosamente', id: Number(id) });
  });
});

// DELETE — protegida
app.delete('/peliculas/:id', verificarToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM peliculas WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Película no encontrada' });
    res.json({ mensaje: 'Película eliminada exitosamente', id: Number(id) });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});