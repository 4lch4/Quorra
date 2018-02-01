const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next()

  res.redirect('/')
}

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

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })
}
