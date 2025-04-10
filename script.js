document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.querySelector("#formulario-seccion form");

    formulario.addEventListener("submit", function (e) {
        e.preventDefault();

        const proteina = document.getElementById("proteina").value;
        const carbohidrato = document.getElementById("carbohidratos").value;
        const grasa = document.getElementById("grasas").value;
        const azucar = document.getElementById("azucares").value;

        const prompt = `Genera un menú saludable con los siguientes ingredientes: ${proteina}, ${carbohidrato}, ${grasa}, y ${azucar}.`;

        fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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", // Reemplaza esto por tu clave real
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "user", content: prompt }
                ]
            })
        })
        .then(res => res.json())
        .then(data => {
            const menu = data.choices[0].message.content;
            mostrarTarjetaMenu(menu);
        })
        .catch(err => {
            console.error("Error:", err);
            mostrarTarjetaMenu("Ocurrió un error generando el menú. Intenta nuevamente.");
        });
    });

    function mostrarTarjetaMenu(texto) {
        const fondo = document.createElement("div");
        fondo.style.position = "fixed";
        fondo.style.top = "0";
        fondo.style.left = "0";
        fondo.style.width = "100vw";
        fondo.style.height = "100vh";
        fondo.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        fondo.style.display = "flex";
        fondo.style.justifyContent = "center";
        fondo.style.alignItems = "center";
        fondo.style.zIndex = "9999";

        const tarjeta = document.createElement("div");
        tarjeta.style.backgroundColor = "#fff";
        tarjeta.style.borderRadius = "10px";
        tarjeta.style.padding = "30px";
        tarjeta.style.maxWidth = "600px";
        tarjeta.style.boxShadow = "0 0 20px rgba(0,0,0,0.3)";
        tarjeta.style.textAlign = "left";
        tarjeta.style.position = "relative";
        tarjeta.style.fontFamily = "Arial, sans-serif";

        const botonCerrar = document.createElement("button");
        botonCerrar.textContent = "Cerrar";
        botonCerrar.style.position = "absolute";
        botonCerrar.style.top = "10px";
        botonCerrar.style.right = "10px";
        botonCerrar.style.padding = "5px 10px";
        botonCerrar.style.backgroundColor = "#dc3545";
        botonCerrar.style.color = "white";
        botonCerrar.style.border = "none";
        botonCerrar.style.borderRadius = "5px";
        botonCerrar.style.cursor = "pointer";

        botonCerrar.addEventListener("click", () => {
            document.body.removeChild(fondo);
        });

        const contenido = document.createElement("pre");
        contenido.textContent = texto;
        contenido.style.whiteSpace = "pre-wrap";

        tarjeta.appendChild(botonCerrar);
        tarjeta.appendChild(contenido);
        fondo.appendChild(tarjeta);
        document.body.appendChild(fondo);
    }
});
