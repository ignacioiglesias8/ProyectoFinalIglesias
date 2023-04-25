//elementos del DOM
const contenedorProductos = document.querySelector("#cards");
let boxCobro = document.getElementById("avisocobro");
let formaDeCobro = document.getElementById("msjFinal");
let limpiarCarro = document.getElementById("limpiar");
let packsSeleccionados = document.getElementById("packsseleccionados");
let finalizarCompra = document.getElementById("finalizar");
let formasDePago = document.querySelectorAll(".radiocobro");

//funciones//
const logica = async() => {
    const productos = await obtenerProductos();
    mostrarProductos(productos);
}

const mostrarProductos = (data) => {
    data.forEach((producto) => {
        const cardProducto = document.createElement("div");
        cardProducto.innerHTML = `<div class="row justify-content-around grad1 softborder rowmargin">
        <aside class="nleft col-md-5 foto${producto.nombre}">
        </aside>
        <aside class="nright col-md-6">
            <h1 class="boxheader font-content">[${producto.id}] Pack ${mayusculizar(producto.nombre)}</h1>
            <div class="boxcontent2 font-content grad1inv">${producto.descripcion}</div>
            <div class="row justify-content-around rowmargin">
                <div class="boxprecio font-content grad1inv">
                ${producto.moneda} ${producto.precio}</div>
                <div class="boxprecio font-content grad1inv">
                    <p>Pasajeros: 
                        <input type="text" class="inputpasajeros" id="cantidad-${producto.id}" name="numPasajeros"/>
                    </p>
                </div>    
            </div>
            <div class="row justify-content-around rowmargin">
                <button class="boxprecio font-content grad1inv btn-primary" id="${producto.id}">Agregar</button>
            </div>
        </aside>
    </div>`;
        contenedorProductos.appendChild(cardProducto);
        let btnAgregar = document.getElementById(`${producto.id}`);
        btnAgregar.addEventListener("click", (e) => {
            let inputCantidad = document.getElementById(`cantidad-${producto.id}`)
            if (producto.clima != "Clouds" && producto.clima != "Clear" && producto.clima != "Drizzle" && producto.clima != "Rain"){
                swal({
                    title: "Cuidado",
                    text: `Por cuestiones climáticas, 
                    este pack no se encuentra disponible`,
                    icon: "error",
                    button: "Cool",
                });               
            }else{
                agregarAlCarrito(e.target.id, inputCantidad);
                Toastify({
                    text: "Producto agregado",
                    duration: 3000,
                    style:{
                        background: 'green'
                    }
                    }).showToast();
            }
        });
    });
};

function mayusculizar (palabra) {
    let mayusculizada = palabra.charAt(0).toUpperCase()+ palabra.slice(1);
    return mayusculizada
}

function conversor(precio, moneda) {
    let modificado = precio * moneda;
    return modificado;
}

function sumarIva(precio) {
    let modificado = precio * 1.21;
    return modificado;
}

function modificador(e) {
    if (e.moneda == "USD") {
        let resultadoModif = conversor(e.precio, dolarBlue);
        return resultadoModif;
    } else {
        let resultadoModif = sumarIva(e.precio);
        return resultadoModif;
    }
}

function multiplicarPasajeros(precio, numero) {
    let resultadoCant = precio * numero;
    return resultadoCant;
}

function guardarDatos(storage, seleccion) {
    const pack = {
        id: prodEncontrado.id,
        nombre: prodEncontrado.nombre.toUpperCase(),
        moneda: "ARS",
        precio: subTotal,
        pasajeros: cantPasajeros,
    };
    if (pack.precio > 0) {
        arrayInt.push(pack)
    }
    storage.setItem(seleccion, JSON.stringify(arrayInt));
}

function mostrarDatos(seleccion) {
    seleccion.innerHTML = "";
    carrito.forEach((item) => {
        const div = document.createElement("div");
        div.innerHTML = `<p>Pack ${item.nombre} para ${item.pasajeros} pasajero(s) por AR$${item.precio}</p>`;
        seleccion.append(div);
    });
}

async function agregarAlCarrito(id, cantidad) {
    cantPasajeros = parseInt(cantidad.value)
    const productos = await obtenerProductos();
    prodEncontrado = productos.find((prod) => prod.id === parseInt(id));
    modificado = modificador(prodEncontrado);
    subTotal = multiplicarPasajeros(modificado, cantPasajeros);
    guardarDatos(localStorage, "carritoGuardado");
    carrito = JSON.parse(localStorage.getItem("carritoGuardado")) || [];
    mostrarDatos(packsSeleccionados);
}

function borrarDatos(storage) {
    storage.clear();
}

function sumarSubTotales(sumatoria) {
    const resultadoTotal = sumatoria.reduce((x, y) => x + y.precio, 0);
    return resultadoTotal;
}

function descontar(precio, descuento) {
    let totalConDescuento = precio - (precio * descuento) / 100;
    return totalConDescuento;
}

function dividirEnCuotas(precio, cuotas) {
    let resultado = precio / cuotas;
    return resultado;
}

function efectivo() {
    if (totalRecuperado > 10000) {
        let descontado = descontar(totalRecuperado, descEnEfectivo);
        formaDeCobro.innerText = `Por compras superior a $10.000, 
        el cliente obtiene 10% de descuento.
        El monto total a cobrar es de $${descontado} en efectivo`;
    } else {
        formaDeCobro.innerText = `El monto total a cobrar es de $${totalRecuperado} 
        en efectivo`;
    }
}

function debito() {
    formaDeCobro.innerText = `El monto total a cobrar es de $${totalRecuperado} 
    con tarjeta de débito`;
    agregarBtn()
}

function credito() {
    if (totalRecuperado < 6000) {
        formaDeCobro.innerText = `Por compras menor a $6.000, el pago solo podrá 
        realizarse en 1 cuota sin interés.
        El monto total a cobrar es de $${totalRecuperado} con tarjeta de crédito 
        en un solo pago`;
    }
    if (totalRecuperado >= 6000 && totalRecuperado < 20000) {
        let division3 = dividirEnCuotas(totalRecuperado, 3);
        formaDeCobro.innerText = `Por compras superior a $6.000, 
        el pago podrá hacerse en: 
        [1] cuota de ${totalRecuperado} 
        [3] cuotas sin interés de $${division3} cada una.`;
    }
    if (totalRecuperado >= 20000) {
        let division3 = dividirEnCuotas(totalRecuperado, 3);
        let division6 = dividirEnCuotas(totalRecuperado, 6);
        formaDeCobro.innerText = `Por compras superior a $20.000, 
        el pago podrá hacerse en:
        [1] cuota de ${totalRecuperado} 
        [3] cuotas sin interés de $${division3} 
        [6] cuotas sin interés de $${division6}.`;
    }
    agregarBtn()
}

function agregarBtn(){
    const btnCobro = document.createElement("div");
    btnCobro.innerHTML = `<div class="row justify-content-around rowmargin">
    <button class="boxbtn font-btn font-content grad1inv btn-primary" id="boxBtnCobro">Cobrar</button>`;
    formaDeCobro.appendChild(btnCobro)
}

//variables
let dolarBlue = parseFloat("380");
let descEnEfectivo = 10;
let modificado;
let cantPasajeros;
let prodEncontrado;
let subTotal;
let montoTotal;
let totalRecuperado;
let carrito;

//nuevo arrays de objetos//
const arrayInt = [];

//simulador seleccionar packs//
logica()

finalizarCompra.addEventListener("click", (e) => {
    e.preventDefault();
    montoTotal = sumarSubTotales(carrito);
    localStorage.setItem("total", JSON.stringify(montoTotal))
    totalRecuperado = parseInt(localStorage.getItem("total"));
    boxCobro.innerText = `El total de la compra es de $${totalRecuperado}`;
});

limpiarCarro.addEventListener("click", () => {
    boxCobro.innerText = `El total de la compra es de $`;
    formaDeCobro.innerHTML = ``;
    packsSeleccionados.innerHTML = ``;
    carrito.splice(0, carrito.length);
    arrayInt.splice(0, arrayInt.length);
    borrarDatos(localStorage);
});

//simulador cobrar al cliente
formasDePago.forEach((item) => {
    item.addEventListener("click", () => {
        let formaDePago = item.value;
        switch (formaDePago) {
            case "efectivo":
                efectivo();
                break;
            case "debito":
                debito();
                break;
            case "credito":
                credito();
                break;
            default:
                formaDeCobro.innerHTML = `Seleccionar una forma de pago`;
                break;
        }
    });
});