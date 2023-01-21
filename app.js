const express = require("express");
const database = require("./database");
require('dotenv').config()

const app = express();

const multer = require('multer')
const upload = multer({ dest: 'public/images/' })
const fs = require('fs')

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))

app.use(express.static("public"));

app.get("/", async (req, res) => {
  images = await database.getImages()
  res.render("index", { images })
})

app.get('/images/:imageName', (req, res) => {
  
  const imageName = req.params.imageName
  const readStream = fs.createReadStream(`public/images/${imageName}`)
  readStream.pipe(res)
})

app.post('/images/save', upload.single('image'), async (req, res) => {
  
  const imageName = req.file.filename
  const description = req.body.description

  const result = await database.addImage(imageName, description)

  res.redirect("/");

})

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});