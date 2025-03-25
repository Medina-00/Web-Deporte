document.getElementById("mlb").addEventListener("click", function () {
  const selectedDate = document.getElementById("fecha").value;
  console.log(selectedDate); // Obtener la fecha seleccionada
  if (selectedDate) {
    const fecha = new Date(selectedDate);

    // Sumar un día

    const nuevaFecha = fecha.toISOString().split("T")[0];
    console.log(nuevaFecha);
    fetch(`https://v1.baseball.api-sports.io/games?date=${nuevaFecha}`, {
      headers: {
        "x-rapidapi-host": "v1.baseball.api-sports.io",
        "x-rapidapi-key": "XXXXXXXXXXXXXXXXXXXX", // Reemplazar con tu clave API
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const filteredGames = data.response.filter((game) =>
          game.league.name.includes("MLB")
        );
        console.log(filteredGames);
        const resultsContainer = document.getElementById("results");
        resultsContainer.innerHTML = ""; // Limpiar los resultados anteriores
        filteredGames.forEach((game) => {
          const lastChar = parseInt(game.status.long.slice(-1));
          const gameInfo = document.createElement("div");
          gameInfo.className = "game-info";
          gameInfo.innerHTML = `
            <h2>${game.league.name}</h2>
            <p><strong>Fecha:</strong> ${nuevaFecha}</p>
            <p><strong>Estado:</strong> ${game.status.long}</p>
            <div class="teams">
              <div class="team">
                <img src="${game.teams.home.logo}" alt="${
            game.teams.home.name
          }" class="team-logo">
                <p>${game.teams.home.name}</p>
              </div>
              <div class="team">
                <img src="${game.teams.away.logo}" alt="${
            game.teams.away.name
          }" class="team-logo">
                <p>${game.teams.away.name}</p>
              </div>
            </div>
            <p><strong>Puntuaciones:</strong> ${
              game.scores.home.total || 0
            } - ${game.scores.away.total || 0}</p>
            <div class="innings">
                        ${
                          game.status.long === "Finished" || game.status.long === "Not Started"
                            ? ""
                            : ` <p><strong>Innings:</strong></p>`
                        }
 
           
            ${Object.entries(game.scores.home.innings)
              .map(([inning]) => {
                if (inning <= lastChar) {
                  return `
                
                <p>Inning ${inning}: ${game.teams.home.name} <strong>${
                    game.scores.home.innings[inning] || 0
                  }</strong> - ${game.teams.away.name} <strong>${
                    game.scores.away.innings[inning] || 0
                  }</strong></p>
              `;
                }
              })
              .join("")}
            </div>
            
          `;
          resultsContainer.appendChild(gameInfo);
        });
      })
      .catch((error) => console.log("error", error));
  } else {
    alert("Por favor, selecciona una fecha.");
  }
});


