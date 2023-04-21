const APIKEY = 'b2a835039a42c114eee3c3021b118473';

function clima(x, y) {
    let lat = x;
    let lon = y;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            let condicionClima = data.weather[0].description;
            return condicionClima;
        });
}

async function obtenerProductos() {
    const productos = [{
            id: 1,
            nombre: "valle",
            moneda: "ARS",
            precio: 3500,
            descripcion: "Salida al Angosto de Jaire. Almuerzo en Yala y tour por las lagunas. Merienda en Termas de Reyes.",
            clima: await clima(-24.185556, -65.299444)
        },
        {
            id: 2,
            nombre: "quebrada",
            moneda: "ARS",
            precio: 5000,
            descripcion: "Salida a Purmamarca. Almuerzo en Tilcara y tour a elección. Merienda y cena en Humahuaca",
            clima: await clima(-23.57681, -65.39342)
        },
        {
            id: 3,
            nombre: "puna",
            moneda: "ARS",
            precio: 8000,
            descripcion: "Salida a Purmamarca. Almuerzo en Suques y tour por los salares. Merienda en Abra Pampa",
            clima: await clima(-23.400556, -66.367222)
        },
        {
            id: 4,
            nombre: "yungas",
            moneda: "ARS",
            precio: 6500,
            descripcion: "Salida a San Pedro. Almuerzo en San Francisco y tour por el Parque Provincial. Merienda en Ledesma",
            clima: await clima(-23.621996, -64.951236)
        },
        {
            id: 5,
            nombre: "tarija",
            moneda: "USD",
            precio: 25,
            descripcion: "Salida hacia la frontera la noche anterior. Recorrido por las principales atracciones de Tarija.",
            clima: await clima(-21.533333, -64.733333)
        },
        {
            id: 6,
            nombre: "atacama",
            moneda: "USD",
            precio: 30,
            descripcion: "Salida hacia la frontera la noche anterior. Recorrido por las principales atracciones de Atacama.",
            clima: await clima(-23.2375, -67.076389)
        },
    ];
    console.log(productos)
}

obtenerProductos();