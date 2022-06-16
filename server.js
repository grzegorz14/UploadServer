var bodyParser = require('body-parser')
var express = require("express")
var app = express()
var formidable = require('formidable')
const path = require("path")
const PORT = 3000
const fs = require("fs")
const fsPromises = require("fs").promises

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"))
});

app.post('/uploadImage', function (req, res) {
    let form = formidable({})
    form.keepExtensions = true
    form.uploadDir = __dirname + '/static/upload/' // folder do zapisu zdjęcia
    form.multiples = true
    form.parse(req, function (err, fields, files) {

        console.log("----- przesłane pola z formularza ------");

        console.log(fields)

        console.log("----- przesłane formularzem pliki ------");

        console.log(files)

        res.send({ uploaded: true })
    })
})

app.post('/getImages', async function (req, res) {
    let images = await list()
    res.send({ images })
})

app.post('/renameImage', async function (req, res) {
    console.log(req.body.image)
    await renameImage(req.body.image, req.body.newName)
    res.send({ ok: "OK" })
})

app.post('/deleteImage', async function (req, res) {
    console.log(req.body.image)
    await deleteImage(req.body.image)
    res.send({ ok: "OK" })
})

const list = async () => {
    try {
        return await fsPromises.readdir(__dirname + "/static/upload")
    } 
    catch (error) {
        console.log(error)
        return []
    }
}

const renameImage = async (name, newName) => {
    try {
        await fsPromises.rename(__dirname + "/static/upload/" + name, __dirname + "/static/upload/" + newName)
        console.log("renamed")          
    } catch (error) {
        console.log(error)
    }
}

const deleteImage = async (image) => {
    try {
        await fsPromises.unlink(__dirname + "/static/upload/" + image)
        console.log("deleted")
    } catch (error) {
        console.log(error);
    }
}

app.listen(PORT, function () {
    console.log("Server runs on port " + PORT)
})

app.use(express.static('static'))