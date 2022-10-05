const express = require('express')

const fs = require('fs')

const router = express.Router()

const leer = fs.readFileSync('./public/data/listadoProductos.json')
const parsearProductos = JSON.parse(leer)

const admin = true;

const esAdministrador = () => {
    return (req,res,next)=>{
        if(admin === true){
            next();
        }else{
            res.send({status:"error",error: `ruta /api/productos${req.url} método ${req.method} no autorizado`})
        }
    }
}


router.get('/', (req,res)=>{
    res.send(parsearProductos)
})

router.get('/:id', (req,res)=>{
    const {id} = req.params
    const productoEncontrado = parsearProductos.find((productoEncontrado) => {
        return productoEncontrado.id == id
    })
    if (productoEncontrado) {
        console.log(`El producto con id ${id} es: `)
        console.log(productoEncontrado)
        res.send(productoEncontrado)
    } else{
        res.send({error: true, msg: 'No se ha encontrado el producto con ese id'})
    }
})

router.post('/', esAdministrador(), (req,res)=>{
    const { nombre, descripcion, codigo, foto, precio, stock} = req.body
    let id;
    /*Este condicional lo hice para evitar que se repita el id al momento de eliminar un producto.
    Primero verifica si hay productos en el array, y en caso de que no haya, le asigna un ID
    Si hay productos en el array, se hace un nuevo array (con el map) con los ids. Aplico un pop, que elimina el ultimo valor del array
    y luego le sumo 1.*/
    if (nombre && descripcion && codigo && foto && precio && stock) {
            if (parsearProductos.length == 0) {
                id = 1
            } else {
                const listaIds = parsearProductos.map((producto)=> {
                    return producto.id
                })
                console.log(listaIds)
                id = listaIds.pop() + 1
            }
        
            const date = new Date()
            let timestamp = date.toLocaleString();
        
            parsearProductos.push({id,timestamp, nombre, descripcion, codigo, foto, precio, stock})
        
            const productosString = JSON.stringify(parsearProductos)
            fs.writeFileSync('./public/data/listadoProductos.json', `${productosString}`)
            const listaActualizada = fs.readFileSync('./public/data/listadoProductos.json')
            const lista = JSON.parse(listaActualizada)
            res.send(lista)
    } else {
        res.send({error: true, msg: 'existen argumentos vacios o incorrectos'})
    }
})

router.put("/:id", esAdministrador(), (req,res)=>{
    const {id} = req.params
    const {timestamp, nombre, descripcion, codigo, foto, precio, stock} = req.body

    //Verificamos que los campos fueron completados
    if (timestamp && nombre && descripcion && codigo && foto && precio && stock) {
        // Buscamos el producto, si lo encuentra seguira con el proceso, y sino enviara un error
        const productoEncontrado = parsearProductos.find((producto)=> producto.id == id)
        if(productoEncontrado) {
            const posicion = parsearProductos.indexOf(productoEncontrado)
            const parsearID = parseInt(id)
            parsearProductos[posicion] = {id: parsearID, timestamp, nombre, descripcion, codigo, foto, precio, stock}
            const productosString = JSON.stringify(parsearProductos)
            fs.writeFileSync('./public/data/listadoProductos.json', `${productosString}`)
            res.send({productoModificado: parsearProductos[posicion]})
        } else {
            res.send({error: true, msg: 'producto no encontrado'})
        }
    } else {
        res.send({error: true, msg: 'existen argumentos vacios o incorrectos'})
    }
})


router.delete("/:id", esAdministrador(), (req,res)=>{
    const {id} = req.params
    const productoEncontrado = parsearProductos.find((producto)=> {
        return producto.id == id
    })
    if (productoEncontrado) {
        const posicion = parsearProductos.indexOf(productoEncontrado)
        parsearProductos.splice(posicion, 1)
        const productosString = JSON.stringify(parsearProductos)
        fs.writeFileSync('./public/data/listadoProductos.json', `${productosString}`)
        const listaActualizada = fs.readFileSync('./public/data/listadoProductos.json')
        const lista = JSON.parse(listaActualizada)
        res.send(lista)
    } else {
        res.send({error: true, msg: 'producto no encontrado'})
    }
})



module.exports = router