const express = require('express')
const app = express()


const productosJS = require('./js/productos.js')
const carritoJS = require('./js/carrito')


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))


app.use('/api/productos',productosJS)
app.use('/api/carrito',carritoJS)

const PORT = process.env.PORT||8080;

app.listen(PORT, ()=>{
    console.log(`Servidor Iniciado en el puerto: ${PORT}`)
})