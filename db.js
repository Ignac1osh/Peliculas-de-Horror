import sqlite3pkg from 'sqlite3';
const sqlite3 = sqlite3pkg.verbose();

const db = new sqlite3.Database('./bd.sqlite', (err) => {
  if (err) {
    console.error('Error al conectar:', err.message);
  } else {
    console.log('Conectado a SQLite.');
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS peliculas (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo       TEXT    NOT NULL,
    director     TEXT    NOT NULL,
    anio         INTEGER NOT NULL,
    subgenero    TEXT    NOT NULL,
    sinopsis     TEXT,
    calificacion REAL    NOT NULL,
    pais         TEXT    NOT NULL,
    es_culto     INTEGER DEFAULT 0
  )
`, (err) => {
  if (err) return console.error('Error al crear tabla:', err.message);
  console.log('Tabla lista.');
  insertarDatos();
});

function insertarDatos() {
  db.get('SELECT COUNT(*) as total FROM peliculas', (err, row) => {
    if (err || row.total > 0) return;

    const peliculas = [
      ['El Resplandor',  'Stanley Kubrick', 1980, 'Psicológico',  'Un escritor enloquece en un hotel aislado.',       8.4, 'EEUU',     1],
      ['Halloween',      'John Carpenter',  1978, 'Slasher',      'Michael Myers vuelve a su pueblo natal.',          7.7, 'EEUU',     1],
      ['Hereditary',     'Ari Aster',       2018, 'Sobrenatural', 'Una familia descubre secretos sobre su linaje.',   7.3, 'EEUU',     0],
      ['REC',            'Jaume Balagueró', 2007, 'Found Footage','Reportera atrapada en edificio en cuarentena.',    7.5, 'España',   1],
      ['Nosferatu',      'F.W. Murnau',     1922, 'Gótico',       'Un agente conoce a un vampiro en Transilvania.',  7.9, 'Alemania', 1],
      ['Get Out',        'Jordan Peele',    2017, 'Psicológico',  'Conspiración en la familia de su novia.',         7.7, 'EEUU',     0],
      ['Alien',          'Ridley Scott',    1979, 'Sci-Fi Horror','Criatura alien caza a la tripulación de una nave.',8.5, 'EEUU',     1],
      ['Midsommar',      'Ari Aster',       2019, 'Psicológico',  'Comunidad pagana con rituales oscuros en Suecia.',7.1, 'EEUU',     0],
      ['Paranormal Activity','Oren Peli',   2007, 'Paranormal',   'Pareja documenta una presencia demoníaca.',       6.3, 'EEUU',     0],
      ['Nosferatu 2024', 'Robert Eggers',   2024, 'Gótico',       'Remake del clásico vampírico de 1922.',           7.2, 'EEUU',     0],
    ];

    const stmt = db.prepare(`
      INSERT INTO peliculas (titulo, director, anio, subgenero, sinopsis, calificacion, pais, es_culto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    peliculas.forEach((p) => stmt.run(p));
    stmt.finalize();
    console.log('10 películas insertadas.');
  });
}

export default db;