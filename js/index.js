// SIMULADOR INTERACTIVO PARA LA ADQUISICIÓN DE LOS SERVICIOS DE MI PÁGINA WEB

const cards = document.getElementById("cards")
const items = document.getElementById("items")
const footer = document.getElementById("footer")
const templateCard = document.getElementById("template-card").content
const templateFooter = document.getElementById("template-footer").content
const templateCarrito = document.getElementById("template-carrito").content
const fragment = document.createDocumentFragment()


$(document).ready(function () {
    fetchData();
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        asignarCarrito()
    }
});

$('#cards').on('click', (e) => {
    addCarrito(e)
});

$('#items').on('click', (e) => {
    botonAccion(e)
});


// ARCHIVO JSON
const fetchData = async () => {
    try {
        const res = await fetch('https://raw.githubusercontent.com/ivinapoli/UnMundoViajesInteractivo/proyectoFinal/js/productos.json')
        const data = await res.json()
        asignarCards(data)
    } catch (error) {
        console.log(error)
    };
};


// ASIGNANDO VALORES DE LOS PRODUCTOS A CADA ELEMENTO/TEMPLATE HTML
const asignarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector("h5").textContent = producto.title
        templateCard.querySelector("p").textContent = producto.price
        templateCard.querySelector("img").setAttribute("src", producto.img)
        templateCard.querySelector(".btn-info").dataset.id = producto.id
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
};


// CARRITO DE SERVICIOS
let carrito = {}

const addCarrito = e => {
    if (e.target.classList.contains("btn-info")){
        setCarrito(e.target.parentElement)
    };
    e.stopPropagation();
};


const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector(".btn-info").dataset.id,
        title: objeto.querySelector("h5").textContent,
        price: objeto.querySelector("p").textContent,
        cantidad: 1
    };
    
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    };

    carrito[producto.id] = {...producto}
    asignarCarrito ();
};


const asignarCarrito = () => {
    items.innerHTML = ""
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector("th").textContent = producto.id
        templateCarrito.querySelectorAll("td")[0].textContent = producto.title
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id
        templateCarrito.querySelector("span").textContent = producto.cantidad * producto.price

        const clonar = templateCarrito.cloneNode(true);
        fragment.appendChild(clonar);
    });

    items.appendChild(fragment);

    asignarFooter();

    localStorage.setItem('carrito', JSON.stringify(carrito))
};


const asignarFooter = () => {
    footer.innerHTML = ""
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = "Carrito vacío. Seleccione alguno de nuestros servicios!";
        return
    };

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0);
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, price}) => acc + cantidad * price, 0);

    templateFooter.querySelectorAll("td")[0].textContent = nCantidad
    templateFooter.querySelector("span").textContent = nPrecio

    const clonar = templateFooter.cloneNode(true)
    fragment.appendChild(clonar)
    footer.appendChild(fragment)

    const vaciarCarrito = document.getElementById("vaciar-carrito")
    vaciarCarrito.addEventListener("click", () => {
        carrito = {}
        asignarCarrito();
    });
};


// SUMAR PRODUCTOS AL CARRITO
const botonAccion = e => {
    if (e.target.classList.contains("btn-info")){
        // console.log(carrito[e.target.dataset.id])
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto}
        asignarCarrito();
    };
// RESTAR PRODUCTOS AL CARRITO
    if (e.target.classList.contains("btn-danger")) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        asignarCarrito();
    };

    e.stopPropagation();
};


// SIMULANDO ENVIAR LA COMPRA REALIZADA AL BACKEND UTILIZANDO LA ESTRUCTURA AJAX (POST/ENVIAR)
    const URLGET = "https://jsonplaceholder.typicode.com/posts";
    const infoPost = { texto: "Compra exitosa" };

    $("#confirmarr").prepend('<button type="button" class="btn btn-info btn-sm carritoVaciarDos" id="confirmar-compra"<span class="fa fa-check"></span>confirmar compra</button');

    $("#confirmar-compra").click(() => {
        $.post(URLGET, infoPost, (respuesta, estado) => {
            if(estado === "success" && Object.keys(carrito).length >= 1) {
                $("#confirmarr").prepend(`<h3 class="carritoEstiloDos" style="display: none">${respuesta.texto}. Muchas gracias por confiar en nosotros!</h3>`);
                $("h3").fadeIn(1300); // (pequeña animación)
            }
        });
    });


// BOTON DE CONFIRMAR COMPRA DESACTIVADO UNA VEZ QUE ES OPRIMIDO
    let botonConfirmar = document.getElementById("confirmar-compra");
    let botonDesactivado = function() { this.disabled = true; };
    botonConfirmar.addEventListener('click', botonDesactivado , false);

