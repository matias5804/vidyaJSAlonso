let carrito = {}//el carrito lo hago con objetos {}

//Detectamos los Botones
const detectarBotones = (data) => {
    const botones = document.querySelectorAll('.gridTienda__card button')//busca los botones dentro de las card- se almacenan los botones 

    botones.forEach(btn => {//recorremos el array de botones 
        btn.addEventListener('click', () => {//se detecta el click en el boton
            console.log(btn.dataset.id)
            const producto = data.find(item => item.id === parseInt(btn.dataset.id))//se busca en data y compara, y se transforma con el parseInt para que sea estrictamente igual
            producto.cantidad = 1 //le agregamos propiedad de la cantidad
            if (carrito.hasOwnProperty(producto.id)) {//pregunto si en el carrito exisste este producto(hasOwnproperty)
                producto.cantidad = carrito[producto.id].cantidad + 1 // si existe se le agrega la cantidad de productos del mismo
            }
            carrito[producto.id] = { ...producto }//si no exite,  se pinta en el carrito ------
            // console.log('carrito', carrito)
            pintarCarrito()//agregamos la funcion pintar carrito
        })
    })
}

const items = document.querySelector('#items')//capturamos los items del html

const pintarCarrito = () => {

    
    items.innerHTML = ''//limpiamos el carrito

    const template = document.querySelector('#template-carrito').content 
    const fragment = document.createDocumentFragment() //para evitar el reflow

    Object.values(carrito).forEach(producto => {//el forEach no funciona en objetos , por eso uso .valuees para pasarlo a Array. Capturamos los valores del carrito
       
        template.querySelector('th').textContent = producto.id
        template.querySelectorAll('td')[0].textContent = producto.title //selecciono el primer elemento([0])
        template.querySelectorAll('td')[1].textContent = producto.cantidad
        template.querySelector('span').textContent = producto.precio * producto.cantidad//el total es igual al precio por la cantidad de productos
        
        //botones
        template.querySelector('.btn-info').dataset.id = producto.id//cada boton tiene su id 
        template.querySelector('.btn-danger').dataset.id = producto.id

        const clone = template.cloneNode(true)//una vez que tenemos los template los clonamos 
        fragment.appendChild(clone)//cuando tenemos el clone lo mandamos en el fragment
    })

    items.appendChild(fragment)//para evitar en reflow 

    pintarFooter() //pintamos el footer 
    accionBotones() //pintamos botones

}


const footer = document.querySelector('#footer-carrito') //seleccionamos el footer del carrito

const pintarFooter = () => { //falta boton de finalizar compra

    footer.innerHTML = ''//hacemos que se elimine "carrito vacio" cuando comienzo a agregar al footer

    if (Object.keys(carrito).length === 0) {//limpiamos el carrito y pintamos otra vez ---> si existen elementos y es igual a 0 - usamos el InnerHtml(carrito Vacio)
        footer.innerHTML = `
        <th scope="row" colspan="5"> Carrito Vacío </th>
        `
        return
    }

    //hacemos una constante que se llame primero el template y despues el fragment
    const template = document.querySelector('#template-footer').content
    const fragment = document.createDocumentFragment()

    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)//lo pasamos a array por que reduce no trabaja con objetos 
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
    

    template.querySelectorAll('td')[0].textContent = nCantidad //pintamos la cantidad en el td [0]
    template.querySelector('span').textContent = nPrecio //pintamos el precio total en el span

    const clone = template.cloneNode(true)//clonamos y copia todo lo que esta en su interior 
    fragment.appendChild(clone)//le pasamos el clone

    footer.appendChild(fragment)//donde van nuestro elemento 


    const botonVaciar = document.querySelector('#vaciar-carrito')//creo la constante botonVaciar
    botonVaciar.addEventListener('click', () => {
        carrito = {}//carrito sea otra vez vacio
        pintarCarrito()//y pintamos otra vez el carrito vacio
    })

}



const accionBotones = () => {
    const botonesAgregar = document.querySelectorAll('#items .btn-info')//seleccionamos el boton del html, en el #items el boton(.btn-info)
    const botonesEliminar = document.querySelectorAll('#items .btn-danger')



    botonesAgregar.forEach(btn => {
        btn.addEventListener('click', () => { //evento al hacer click en el boton de (+)
         
            const producto = carrito[btn.dataset.id] //
            producto.cantidad ++
            carrito[btn.dataset.id] = { ...producto }
            pintarCarrito()//pintamos para que se actualice 
        })
    })

    botonesEliminar.forEach(btn => {//para eliminar , primero hay que ir disminuyendo y si queda uno solo elimina el producto
        btn.addEventListener('click', () => {
            
            const producto = carrito[btn.dataset.id]
            producto.cantidad--
            if (producto.cantidad === 0) {//si producto es  = 0 se limpia este producto del carrito
                delete carrito[btn.dataset.id]//elimina solo el producto
            } else {
                carrito[btn.dataset.id] = { ...producto }
            }
            pintarCarrito()
        })
    })
}
