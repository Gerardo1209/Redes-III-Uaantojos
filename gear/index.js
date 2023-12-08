const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({path: __dirname+'/.env'});
const PORT = process.env.PORT || 3000;
const app = express()
const rutas = require('./Rutas/rutas');
app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use('/', rutas);

app.listen(PORT, (err) => {
    if(err){
        console.log("Ocurrio un error: " + err)
        return
    }
    console.log("Servidor escuchando en el puerto " + PORT)
})
