const express = require('express')
const app = express()


const productosJS = require('./js/productos.js')
const carritoJS = require('./js/carrito')


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))


app.use('/api/productos',productosJS)
app.use('/api/carrito',carritoJS)


app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.get('*', function (req, res) {

    res.send({ status: "error", description: `ruta ${req.url} método ${req.method} no implementada` });

}

)

const PORT = process.env.PORT||8080;


app.listen(PORT, ()=>{
    console.log(`Servidor Iniciado en el puerto: ${PORT}`)
})