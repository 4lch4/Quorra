const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('connect-flash')

const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')

const configdb = require('./config/database')

mongoose.connect(configdb.url)

require('./config/passport')(passport)

// Setup express
app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser())

app.set('view engine', 'ejs')

app.use(session({ secret: 'testingthisthingout' }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

require('./app/routes')(app, passport)

app.listen(port)
console.log(`Magic happens on port ${port}`)
