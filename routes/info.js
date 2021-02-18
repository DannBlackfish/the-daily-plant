const express       = require('express');
const router        = express.Router();
const Info          = require('../models/Info.model.js');
const uploadCloud   = require('../configs/cloudinary.config.js')

router.get('/info/detail/:id',(req,res,next)=>{

  const id = req.params.id

  Info.findById(id)
  .then((detailPlant)=>{
    res.render('info/detail', {info: detailPlant})
  })
  .catch(error =>next(error))
})

//Edit plants
router.post('/info/detail/:id', uploadCloud.single('image'), (req, res, next) => {

  const {id} = req.params
  const {image, name} = req.body
  const urlimage = req.file.path
  Info.create({
     image
   })
  // .then((addPlant) => {
  //   res.redirect('/info/detail')
  // })

  Info.findByIdAndUpdate(id, {image, name}, {new:true})
  .then((updated) => {
    res.redirect(`/info/${updated.id}`)})
  .catch(error => next(error))
});




//Deleting Plants
router.post('/info/delete/:id', (req, res, next) => {
  
  const id = req.params.id

  Info.findByIdAndDelete(id)
  .then(() =>{
    res.redirect('/userProfile')
  })
  .catch((error)=> next(error))
});

//Adding New Plants
router.get('/info/new', (req, res, next) => {
  res.render('info/new')
});

router.post('/info/new', (req, res, next) => {
  const {name} = req.body
  Info.create({
    name
  })
  .then((addPlant) => {
    res.redirect('/userProfile')
  })

  .catch(error => {
    res.render('info/new')
  })
});

//Edit plants 



// EXPORTACIÓN
module.exports = router;