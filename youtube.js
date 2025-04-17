const API_KEY = 'AIzaSyDaM8wADWPvuSqH32M59HrUOmuuQ2Zi2G0'; // Reemplaza con tu clave de API real

async function searchYouTube() {
  const query = document.getElementById("searchInput").value;
  if (!query) return alert("Ingresa una búsqueda");

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      showVideo(videoId);
    } else {
      alert("No se encontró ningún video 😕");
    }
  } catch (error) {
    console.error("Error al buscar en YouTube:", error);
  }
}

function showVideo(videoId) {
  const videoContainer = document.getElementById("videoContainer");
  videoContainer.innerHTML = `
    <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" 
      frameborder="0" allowfullscreen></iframe>`;
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("videoContainer").innerHTML = "";
}
