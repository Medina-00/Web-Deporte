// Función para obtener los datos de la API
document.getElementById("verResultados").addEventListener("click", function () {
  const selectedDate = document.getElementById("fecha").value;
  console.log(selectedDate); // Obtener la fecha seleccionada
  if (selectedDate) {
    const fecha = new Date(selectedDate);

    // Sumar un día
    fecha.setDate(fecha.getDate() + 1);
    const nuevaFecha = fecha.toISOString().split("T")[0];
    console.log(nuevaFecha);
    fetch(`https://v1.basketball.api-sports.io/games?date=${nuevaFecha}`, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "v1.basketball.api-sports.io",
        "x-rapidapi-key": "XXXXXXXXXXXXXXXXXXXXX", // Reemplazar con tu clave API
      },
    })
      .then((response) => response.json()) // Convertir la respuesta a JSON
      .then((data) => {
        // Limpiar los resultados anteriores
        const contenedor = document.getElementById("games");
        contenedor.innerHTML = ""; // Limpiar los juegos previos

        console.log(data.response);
        // Filtrar solo los juegos de la NBA
        if (data.response && data.response.length > 0) {
          data.response.forEach((game) => {
            // Verificar si la liga es la NBA
            if (game.league.name === "NBA") {
              mostrarJuego(game); // Mostrar solo los juegos de la NBA
            }
          });
        } else {
          contenedor.innerHTML = "No hay juegos disponibles para esta fecha.";
        }
      })
      .catch((err) => {
        console.log("Error al obtener los datos:", err);
      });
  } else {
    alert("Por favor, selecciona una fecha.");
  }
});

// Función para mostrar el juego en la página
function mostrarJuego(game) {
  const contenedor = document.getElementById("games");
  const gameDiv = document.createElement("div");
  gameDiv.classList.add("game");

  // Formatear la fecha
  const fecha = new Date(game.date); // 'date' contiene la fecha en formato ISO
  const fechaFormato = `${fecha.getDate()}/${
    fecha.getMonth() + 1
  }/${fecha.getFullYear()}`;

  gameDiv.innerHTML = `
        <h2>${game.league.name} - Temporada ${game.league.season}</h2>
        <div class="teams">
            <div>
                <img src="${game.teams.home.logo}" alt="${game.teams.home.name}">
                <span>${game.teams.home.name}</span>
            </div>
            <div class="score">
                ${game.scores.home.total || 0} - ${game.scores.away.total || 0}
            </div>
            <div>
                <img src="${game.teams.away.logo}" alt="${game.teams.away.name}">
                <span>${game.teams.away.name}</span>
            </div>
        </div>
        <div class="status">
            <strong>Estado:</strong> ${game.status.long}
        </div>
        
        <div>
            <strong>Fecha:</strong> ${fechaFormato} ${game.time} UTC
        </div>
        <div>
            <strong>Estadio:</strong> ${game.venue}
        </div>
        ${game.status.long === "Not Started" ? `` : ` <div class="quarters">
            <h3>Puntaje por Cuarto:</h3>
            <ul>
                <li>1er Cuarto: ${game.scores.home.quarter_1} - ${game.scores.away.quarter_1}</li>
                <li>2do Cuarto: ${game.scores.home.quarter_2} - ${game.scores.away.quarter_2}</li>
                <li>3er Cuarto: ${game.scores.home.quarter_3} - ${game.scores.away.quarter_3}</li>
                <li>4to Cuarto: ${game.scores.home.quarter_4} - ${game.scores.away.quarter_4}</li>
            </ul>
        </div>`}
       
    `;
  contenedor.appendChild(gameDiv);
}


window.onload = obtenerResultados;
