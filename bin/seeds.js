const mongoose      = require('mongoose');
const Info         = require('../models/Info.model.js')

const DB_NAME = 'the-daily-plant'//Nombre de base de datos

mongoose.connect(`mongodb://localhost/${DB_NAME}`,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//DATOS DENTRO DE UNA VARIABLE
const info = [
    {
      name: 'CHILI',
      scientificName: 'Capsicum frutescens Siling labuyo',
      origin: 'It was developed in the Philippines after being imported from America by the Columbian exchange.',
      care:
        "They are used in pots for patios, terraces and balconies.",
      place:
        "Outside",
      image:
        '/images/fruta_chili.png'
    },
    {
      name: 'LETTUCE',
      scientificName: 'Lactuca sativa',
      origin: 'This leaf vegetable was first cultivated by the Egyptians.',
      care:
        "Lettuce likes humid and cool climates.",
      place:
        "Outside",
      image:
        '/images/fruta_lettuce.png'
    },
    {
      name: 'STRAWBERRY',
      scientificName: 'Fragaria',
      origin: 'The garden strawberry was first bred in Brittany, France, in the 1750s.',
      care:
        "They prefer the sun or partial shade in fertile, cool soil that's well drained and chalky.",
      place:
        "Outside/Inside",
      image:
        '/images/fruta_strawberry.png'
    },
    {
      name: 'TOMATO',
      scientificName: 'Solanum lycopersicum',
      origin: 'Is native to Central America and North and Northwest South America.',
      care:
        "Can be easily grown on balconies or patios!",
      place:
        "Outside/Inside",
      image:
        '/images/fruta_tomato.png'
    },
    {
      name: 'PEACH',
      scientificName: 'Prunus persica',
      origin: 'It is a tree native to Afghanistan, China and Iran.',
      care:
        "The exposure of this species should be in full sun and with good ventilation. This allows cool air to circulate during cold nights and keeps the area cool in summer.",
      place:
        "Outside",
      image:
        '/images/fruta_peach.png'
    },
    {
      name: 'APPLE',
      scientificName: 'Malus domestica',
      origin: 'The tree originated in Central Asia, where its wild ancestor, Malus sieversii, is still found today.',
      care:
        "Apple trees are unlikely to need regular watering, except in extreme drought conditions.",
      place:
        "Outside",
      image:
        '/images/fruta_apple.png'
    },
    {
      name: 'ORANGE',
      scientificName: 'Citrus X sinensis',
      origin: 'Orange trees originate from India, Pakistan, Vietnam and southeastern China.',
      care:
        "They are used as isolated specimens or in small groups and also in pots for patios.",
      place:
        "Outside",
      image:
        '/images/fruta_orange.png'
    },
    {
      name: 'GREEN PEAS',
      scientificName: 'Pisum sativum',
      origin: 'Are original from the Old Continent.',
      care: "Just keep an eye out for aphids on the pea plants and get rid of them with a sharp spray of water from the garden hose.",
      place:
        "Outside",
      image:
        '/images/fruta_greenpeas.png'
    },
    {
      name: 'CUCUMBER',
      scientificName: 'Cucumis sativus',
      origin: 'The cucumber originates from South Asia.',
      care: "For outdoors try planting them on new compost heaps, where the heat from the rotting material will benefit the crop.",
      place:
        "Outside/Inside",
      image:
        '/images/fruta_cucumber.png'
    },
    {
      name: 'GUAVA',
      scientificName: 'Psidium guajava',
      origin: 'Native to Mexico, Central America, the Caribbean and northern South America.',
      care: 'native to Mexico, Central America, the Caribbean and northern South America.',
      place:
        "Outside",
      image:
        '/images/fruta_guava.png'
    }
  ];
  
// Add here the script that will be run to actually seed the database (feel free to refer to the previous lesson)
Info.create(info)
  .then(infoFromDB => {
      console.log(`Created ${infoFromDB.length} info`);

      mongoose.connection.close();
  })
  .catch(err => console.log(`An error occurred while creating info from the DB: ${err}`));
