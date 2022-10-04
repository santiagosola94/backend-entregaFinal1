const express = require('express')
const router = express.Router()
const fs = require('fs')


const leer = fs.readFileSync('./public/data/listadoCarritos.json')
const listadoCarrito = JSON.parse(leer)
const leerProductos = fs.readFileSync('./public/data/listadoProductos.json')
const listadoProductos = JSON.parse(leerProductos)

router.get('/', (req,res)=>{
    res.send(
        listadoCarrito
    )
})

router.get('/:id/productos', (req,res)=>{
    const {id} = req.params
    const carritoEncontrado = listadoCarrito.find((element)=> {return element.id == id})
    if (carritoEncontrado) {
        const productosAgregadosAlCarrito = carritoEncontrado.productos
        res.send(
            productosAgregadosAlCarrito
        )
    } else {
        res.send({error: true, msg: 'No se ha encontrado el carrito con ese id'})
    }
})

router.post('/', (req,res)=>{
    let id;

    if (listadoCarrito.length == 0) {
        id = 1
    } else {
        const listaIds = listadoCarrito.map((producto)=> {
            return producto.id
        })
        id = listaIds.pop() + 1
    }

    const date = new Date()
    let timestamp = date.toLocaleString();


    listadoCarrito.push({id, timestampCarrito: timestamp, productos: []})

    const productosString = JSON.stringify(listadoCarrito)
    fs.writeFileSync('./public/data/listadoCarritos.json', `${productosString}`)

    res.send(listadoCarrito)
})

router.post("/:id/productos/:idProducto", (req,res)=>{
    //primero debemos encontrar el producto a agregar
    const {id, idProducto} = req.params
    const productoEncontrado = listadoProductos.find((element)=> {return element.id == idProducto})
    const carritoEncontrado = listadoCarrito.find((element)=> {return element.id == id})

    if (productoEncontrado && carritoEncontrado) {
            const variable = carritoEncontrado.productos
            variable.push(productoEncontrado)
            const productosString = JSON.stringify(listadoCarrito)
            fs.writeFileSync('./public/data/listadoCarritos.json', `${productosString}`)
        
        res.send(listadoCarrito)
    } else{
        res.send({error: true, msg: 'No se ha encontrado el carrito/producto con ese id'})
    }

})

/* elimina el carro*/
router.delete("/:id", (req,res)=>{
    const {id} = req.params
    const productoEncontrado = listadoCarrito.find((producto)=> {
        return producto.id == id
    })
    if (productoEncontrado) {
        const posicion = listadoCarrito.indexOf(productoEncontrado)
        listadoCarrito.splice(posicion, 1)
        const productosString = JSON.stringify(listadoCarrito)
        fs.writeFileSync('./public/data/listadoCarritos.json', `${productosString}`)
        res.send(listadoCarrito)
    } else {
        res.send({error: true, msg: 'No se ha encontrado el carrito con ese id'})
    }
})

router.delete("/:id/productos/:id_prod", (req,res)=>{
    const {id, id_prod} = req.params

    const carritoEncontrado = listadoCarrito.find((element)=> {return element.id == id})
    const posicionDelCarro = listadoCarrito.indexOf(carritoEncontrado)
    
    /* Necesitamos el array para trabajar con el*/
    const productosAgregadosAlCarro = carritoEncontrado.productos


    const productoEncontrado = productosAgregadosAlCarro.find((element)=> {return element.id == id_prod})

    const posicionDelProducto = productosAgregadosAlCarro.indexOf(productoEncontrado)

    if (carritoEncontrado && productoEncontrado) {
        //Con la posicion del producto, podemos eliminar el producto del Carrito
        productosAgregadosAlCarro.splice(posicionDelProducto, 1)
        //Luego de eliminar el producto, volvemos a asignar el array actualizado sin el producto eliminado
        carritoEncontrado.productos= productosAgregadosAlCarro
        /*Aca obtenemos la lista de los carritos, y con la posicion del carro a modificar, le asignamos 
        el nuevo valor actualizado*/
        listadoCarrito[posicionDelCarro] = carritoEncontrado

        const carritoString = JSON.stringify(listadoCarrito)
        fs.writeFileSync('./public/data/listadoCarritos.json', `${carritoString}`)
        res.send(listadoCarrito)
    } else{
        res.send({error: true, msg: 'No se ha encontrado el carrito/producto con ese id'})
    }
})



module.exports = router;