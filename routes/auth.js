// IMPORTACIONES
const { Router }    = require('express');
const router        = new Router();
const bcrypt        = require('bcrypt');
const saltRounds    = 10;
const mongoose      = require('mongoose');
const User          = require('../models/User.model')
const Info          = require('../models/Info.model.js');
const uploadCloud   = require('../configs/cloudinary.config.js')

// RUTAS
// GET - REGISTRO
router.get('/signup', (req, res) => res.render('auth/signup'));

// POST - REGISTRO
router.post('/signup', uploadCloud.single('imageProfile'), (req, res, next) => {
  console.log(req.body)
  const { username, email, password } = req.body;
  const urlimage = req.file.path

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  if (!username || !email || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }

  bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        email,
        passwordHash: hashedPassword,
        imagen: urlimage
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
      req.session.currentUser = userFromDB;
      res.redirect('/userProfile');
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
           errorMessage: 'Username and email need to be unique. Either username or email is already used.'
        });
      } else {
        next(error);
      }
    }); // close .catch()
});

// GET - PERFIL DE USUARIO
router.get('/userProfile', (req, res) => {
  const fecha = new Date();
  const day = fecha.getDay();
  console.log(day)

  Info.find()
  .then((infoFromDB) => {
    console.log(req.session.currentUser)
    if (day === 6) {
      res.render('users/user-profile', {
        message: 'Today is the day to water your plant',
        userInSession: req.session.currentUser,
        info: infoFromDB
      }) 
    } else {
      res.render('users/user-profile', { 
        message: 'Your plant does not need water', 
        userInSession: req.session.currentUser, 
        info: infoFromDB
       });
    }
  }).catch(error => {
    console.log("Can't show the plants")
    next(error)
  })
});

//GET REMINDER DE USUARIO
router.get('/users/reminderUser', (req,res,next) => {
  console.log(req.session.currentUser)
  res.render('users/reminderUser', {
    reminder: req.session.currentUser
  })
})
//POST DE REMINDER DE USUARIO
router.post('/users/reminderUser', (req,res,next) =>{
  const {_id} = req.session.currentUser
  const {reminder} = req.body
  console.log({reminder})

    User.findByIdAndUpdate(_id, {$addToSet: {reminder}},{new:true})
    .then((responseDB)=>{
      req.session.currentUser = responseDB
      res.redirect('/users/reminderUser')
    })
})

//GET UPDATE USUARIO
router.get('/editProfile', (req,res,next) => {
  res.render('users/editProfile', {
    userInSession: req.session.currentUser,
  })
})
//POST UPDATE USUARIO
router.post('/editProfile', uploadCloud.single('imageProfile'), (req,res,next) =>{
  const {username} = req.body
  const {_id} = req.session.currentUser

  if(!req.file){
    const path = req.session.currentUser.imagen
    User.findByIdAndUpdate(_id, {$set: {username,imagen:path}},{new:true})
    .then((responseDB)=>{
      req.session.currentUser = responseDB
      res.redirect('/userProfile')
    })
  } else{
    const {path} = req.file
    User.findByIdAndUpdate(_id, {$set: {username,imagen:path}},{new:true})
  .then((responseDB)=>{
    req.session.currentUser = responseDB
    res.redirect('/userProfile')
  })
  }  
})


// LOGIN
// .get() route ==> to display the login form to users
router.get('/login', (req, res) => res.render('auth/login'));

// .post() route ==> process form
router.post('/login', (req, res, next) => {

  console.log('SESSION =====> ', req.session);
  console.log(req.body)
  const {email, password} = req.body;


  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }

  User.findOne({email}) // <== check if there's user with the provided email
        .then(user => {

          if (!user) {
            res.render('auth/login', {
              errorMessage: 'Email is not registered. Try with other email.'
            });
            return;
          }

          else if (bcrypt.compareSync(password, user.passwordHash)) {
            // res.render('users/userProfile', { user });

            req.session.currentUser = user;
            console.log(new Date())
            res.redirect('/userProfile');

          } else {
            res.render('auth/login', { errorMessage: 'Incorrect password.' });
          }
        })
        .catch(error => next(error));
})


// PRIVADO
router.get('/private' ,(req,res) => {
  if(req.session.currentUser) {
    return res.render("private")
  }
  res.send("No estas loggeado, es un área privada X.")
})

//LOGOUT
router.post('/logout', (req,res,next) => {
  req.session.destroy()
  res.redirect('/')
})


// EXPORTACIÓN
module.exports = router;