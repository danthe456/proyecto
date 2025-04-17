document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formulario-generar-menu");
    const modal = document.getElementById("modalMenu");
    const contenido = document.getElementById("contenido-menu");
    const cerrarBtn = document.querySelector(".cerrar-modal");

    // Asegurarse que todos los elementos existen antes de añadir listeners
    if (!form || !modal || !contenido || !cerrarBtn) {
        console.error("Error: No se encontraron todos los elementos del DOM necesarios para el generador de menú.");
        return; // Detener ejecución si falta algo esencial
    }


    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

        // Obtener valores seleccionados
        const proteina = document.getElementById("proteina").value;
        const carbohidratos = document.getElementById("carbohidratos").value;
        const grasas = document.getElementById("grasas").value;
        const azucares = document.getElementById("azucares").value;
        const tipo = document.getElementById("tipo").value;


        // Validar que se haya seleccionado algo (aunque 'required' ayuda)
        if (!proteina || !carbohidratos || !grasas || !azucares || !tipo) {
            alert("Por favor, selecciona una opción en cada categoría.");
            return;
        }

        // Construir el prompt para la IA
        const prompt = `Genera una idea de menú saludable para una comida (puede ser almuerzo o cena) que incluya principalmente:
        - Proteína: ${proteina}
        - Carbohidrato: ${carbohidratos}
        - Grasa saludable: ${grasas}
        -si es para una comida o cena: ${tipo}
        - Como fuente opcional de dulce/azúcar: ${azucares === 'Nada' ? 'ninguna fuente de azúcar añadida o dulce prominente' : azucares}.
        Describe el plato de forma apetitosa y concisa. Puedes añadir alguna verdura o acompañamiento que combine bien.`;

        // Mostrar algún indicador de carga (opcional)
        contenido.innerHTML = "Generando menú... por favor espera.";
        modal.style.display = "block";

        try {
            // --- ¡INICIO ZONA INSEGURA REVERTIDA POR SOLICITUD DEL USUARIO! ---
            // Usando la URL y clave exactas proporcionadas originalmente.
            const apiKey = "AIzaSyB-TxNGctuHrM3Slwk27_ETUgY4aWRTgiI"; // <-- ¡CLAVE EXPUESTA!
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`; // URL Original con clave

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });
            // --- ¡FIN ZONA INSEGURA! ---

            if (!response.ok) {
                // Intentar obtener más detalles del error si es posible
                let errorData = await response.text(); // Leer como texto por si no es JSON
                try {
                    errorData = JSON.parse(errorData); // Intentar parsear como JSON
                } catch(parseError) {
                    // Mantener como texto si no es JSON
                }
                console.error("Error en la respuesta de la API:", response.status, errorData);
                // Mostrar error más específico si es posible (ej. error 400, 403, etc.)
                let friendlyErrorMessage = `Error de la API (${response.status}). Verifica la clave API, el endpoint o los datos enviados. Revisa la consola para detalles.`;
                 if (response.status === 403) friendlyErrorMessage = "Error de Permiso (403): Verifica que la clave API sea correcta y tenga permisos para usar el modelo 'gemini-2.0-flash'.";
                 if (response.status === 400) friendlyErrorMessage = "Error en la Solicitud (400): Revisa el formato del 'prompt' o los datos enviados. Revisa la consola.";
                 if (response.status === 429) friendlyErrorMessage = "Límite de Cuota Excedido (429): Has realizado demasiadas solicitudes. Espera un momento.";

                throw new Error(friendlyErrorMessage);
            }

            const data = await response.json();

            // Procesar la respuesta
            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                const menu = data.candidates[0].content.parts[0].text;
                mostrarMenu(menu); // Llama a la función que actualiza el modal
            } else if (data.promptFeedback && data.promptFeedback.blockReason) {
                 // Si la API bloqueó la solicitud por seguridad u otra razón
                 console.warn("Respuesta bloqueada por la API:", data.promptFeedback.blockReason);
                 mostrarMenu(`Lo siento, tu solicitud no pudo ser procesada debido a: ${data.promptFeedback.blockReason}. Intenta con ingredientes diferentes.`);
            }
            else {
                console.error("Respuesta inesperada de la API:", data);
                throw new Error("No se recibió contenido válido del modelo en la respuesta.");
            }
        } catch (error) {
            console.error("Error al generar el menú:", error);
            // Mostrar error en el modal
            mostrarMenu(`Lo siento, ocurrió un error al generar tu menú. Por favor, inténtalo de nuevo más tarde. Detalles: ${error.message}`);
        }
    });

    // Función para mostrar el menú en el modal (sin cambios)
    function mostrarMenu(menuTexto) {
        let htmlMenu = menuTexto
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, "<br>");

        contenido.innerHTML = htmlMenu;
        modal.style.display = "block";
    }

    // Event listener para el botón de cerrar (sin cambios)
    cerrarBtn.onclick = () => {
        modal.style.display = "none";
    };

    // Event listener para cerrar haciendo clic fuera (sin cambios)
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
});
