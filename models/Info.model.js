const { Schema, model } = require('mongoose');
 
const infoSchema = new Schema(
  {
    name: String,
    scientificName: String,
    origin: String,
    care: String,
    place: String,
    image: String
  }
);

//GENERACION DEL MODELO
const Info = model('Info', infoSchema)

//EXPORTACIONES
module.exports = Info