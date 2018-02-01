const express = require('express')
const multer = require('multer')
const path = require('path')
const app = express()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/', upload.array('fileUpload'), (req, res) => {
  if (req.files === undefined) console.log(`File(s) was/were not uploaded.`)
  res.redirect('/')
})

app.listen(3000, () => {
  console.log(`Listening on port 3000...`)
})
