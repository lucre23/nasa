document.getElementById("btnBuscar").addEventListener("click", () => {
    const query = document.getElementById("inputBuscar").value.trim();
    if (query) {
        buscarImagenes(query);
        actualizarURL(query);
    } else {
        alert("Por favor, ingresa un parámetro de búsqueda.");
    }
});

async function buscarImagenes(query) {
    try {
        const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}`;
        console.log(url); // Imprime la URL en la consola

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        const resultados = data.collection.items;
        
        if (resultados.length === 0) {
            mostrarMensaje("No se encontraron resultados.");
        } else {
            mostrarResultados(resultados);
        }
    } catch (error) {
        console.error("Error al obtener los datos de la API", error);
        mostrarMensaje("Error al realizar la búsqueda. Intenta nuevamente.");
    }
}

function actualizarURL(query){
    const nuevaURL = `${window.location.origin}${window.location.pathname}?search=${encodeURIComponent(query)}`;
    window.history.pushState({ path: nuevaURL }, '', nuevaURL);
}

function mostrarResultados(resultados) {
    const contenedor = document.getElementById("contenedor");
    contenedor.innerHTML = ""; // Limpiamos los resultados anteriores

    resultados.forEach(item => {
        // Desestructuración y verificación de datos
        const { title, date_created, description } = item.data[0];
        const imageUrl = item.links ? item.links[0].href : 'https://via.placeholder.com/150';

        const tarjeta = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="${imageUrl}" class="card-img-top" alt="${title}">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${description || 'Sin descripción disponible.'}</p>
                        <p class="card-text"><small class="text-muted">${new Date(date_created).toLocaleDateString()}</small></p>
                    </div>
                </div>
            </div>
        `;

        contenedor.innerHTML += tarjeta;
    });
}

function mostrarMensaje(mensaje) {
    const contenedor = document.getElementById("contenedor");
    contenedor.innerHTML = `<p class="text-center">${mensaje}</p>`;
}
