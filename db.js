import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

// Modelo de Pelicula
export const Pelicula = sequelize.define('Pelicula', {
  titulo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  director: {
    type: Sequelize.STRING,
    allowNull: false
  },
  anio: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  subgenero: {
    type: Sequelize.STRING,
    allowNull: false
  },
  sinopsis: {
    type: Sequelize.TEXT
  },
  calificacion: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  pais: {
    type: Sequelize.STRING,
    allowNull: false
  },
  es_culto: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
});

// Sincronizar y poblar datos
async function iniciarDB() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a PostgreSQL.');
    await sequelize.sync({ force: false });
    console.log('Tablas sincronizadas.');

    const total = await Pelicula.count();
    if (total === 0) {
      await Pelicula.bulkCreate([
        { titulo: 'El Resplandor',   director: 'Stanley Kubrick', anio: 1980, subgenero: 'Psicológico',  sinopsis: 'Un escritor enloquece en un hotel aislado.',        calificacion: 8.4, pais: 'EEUU',     es_culto: 1 },
        { titulo: 'Halloween',       director: 'John Carpenter',  anio: 1978, subgenero: 'Slasher',      sinopsis: 'Michael Myers vuelve a su pueblo natal.',           calificacion: 7.7, pais: 'EEUU',     es_culto: 1 },
        { titulo: 'Hereditary',      director: 'Ari Aster',       anio: 2018, subgenero: 'Sobrenatural', sinopsis: 'Una familia descubre secretos sobre su linaje.',    calificacion: 7.3, pais: 'EEUU',     es_culto: 0 },
        { titulo: 'REC',             director: 'Jaume Balagueró', anio: 2007, subgenero: 'Found Footage',sinopsis: 'Reportera atrapada en edificio en cuarentena.',     calificacion: 7.5, pais: 'España',   es_culto: 1 },
        { titulo: 'Nosferatu',       director: 'F.W. Murnau',     anio: 1922, subgenero: 'Gótico',       sinopsis: 'Un agente conoce a un vampiro en Transilvania.',   calificacion: 7.9, pais: 'Alemania', es_culto: 1 },
        { titulo: 'Get Out',         director: 'Jordan Peele',    anio: 2017, subgenero: 'Psicológico',  sinopsis: 'Conspiración en la familia de su novia.',          calificacion: 7.7, pais: 'EEUU',     es_culto: 0 },
        { titulo: 'Alien',           director: 'Ridley Scott',    anio: 1979, subgenero: 'Sci-Fi Horror',sinopsis: 'Criatura alien caza a la tripulación de una nave.', calificacion: 8.5, pais: 'EEUU',     es_culto: 1 },
        { titulo: 'Midsommar',       director: 'Ari Aster',       anio: 2019, subgenero: 'Psicológico',  sinopsis: 'Comunidad pagana con rituales oscuros en Suecia.', calificacion: 7.1, pais: 'EEUU',     es_culto: 0 },
        { titulo: 'Paranormal Activity', director: 'Oren