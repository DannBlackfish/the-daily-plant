const express = require('express');
const router  = express.Router();
const Info    = require('../models/Info.model.js');


router.get('/info/detail/:id',(req,res,next)=>{

  const id = req.params.id

  Info.findById(id)
  .then((detailPlant)=>{
    res.render('info/detail', {info: detailPlant})
  })
  .catch(error =>next(error))
})

// EXPORTACIÓN
module.exports = router;