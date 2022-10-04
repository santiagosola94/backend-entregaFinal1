

function eliminarProducto(event) {
    const hola = event.target.id

    const deleteMethod = {
        method: 'DELETE', // Method itself
        headers: {
        'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
        },
        }
    fetch(`/api/carrito/${hola}`, deleteMethod)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err), console.log('esta era la data'))
}

function agregarProductoAlCarro(event){
    console.log('entro')
    const idProducto = document.getElementById('productoElegido').value
    console.log(idProducto)
    const idCarro = document.getElementById('carritoElegido').value
    console.log(idCarro)

    const postMethod = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
        }
    }

    fetch(`/api/carrito/${idCarro}/${idProducto}`, postMethod)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
}

// <select name="productos" id="productoElegido" onchange=agregarProductoAlCarro(event) required>