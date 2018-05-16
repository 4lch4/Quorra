const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next()

  res.redirect('/')
}

const { join } = require('path')
const { lstatSync, readdirSync } = require('fs')
const imgsPath = '../tron/images'

const isDirectory = src => lstatSync(src).isDirectory()
const getDirectories = src => readdirSync(src).map(name => join(src, name)).filter(isDirectory)
const getDirectoryNames = dirs => {
  let names = []
  dirs.forEach(dir => names.push(dir.substring(dir.lastIndexOf('/') + 1)))
  return names
}

const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(imgsPath, req.body.folder))
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/(\.png$|\.gif$|\.jpg$)/) === null) cb(null, false)
    else if (req.headers['content-length'] > 8000000) cb(null, false)
    else cb(null, true)
  }
})

module.exports = (app, passport) => {
  app.get('/', (req, res) => {
    res.render('index.ejs')
  })

  app.get('/login', (req, res) => {
    res.render('login.ejs', { message: req.flash('loginMessage') })
  })

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }))

  app.get('/stipulateconsent', (req, res) => {
    res.render('signup.ejs', { message: req.flash('signupMessage') })
  })

  app.post('/stipulateconsent', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/stipulateconsent',
    failureFlash: true
  }))

  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs', { user: req.user })
  })

  app.get('/upload', isLoggedIn, (req, res) => {
    res.render('upload.ejs', { user: req.user, message: '', paths: getDirectoryNames(getDirectories(imgsPath)) })
  })

  app.post('/upload', upload.array('fileUpload'), (req, res) => {
    if (req.files.length === 0) res.render('upload.ejs', { user: req.user, message: 'Failed upload, make sure the file is not too large and it is actually a png/jpg/gif.' })
    else res.render('upload.ejs', { user: req.user, message: `${req.files.length} image(s) uploaded.`, paths: getDirectoryNames(getDirectories(imgsPath)) })
  })

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })
}
