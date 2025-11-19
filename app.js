class Message {
    constructor(nombre, email, texto, prioridad) {
        this.nombre = nombre;
        this.email = email;
        this.texto = texto;
        this.prioridad = prioridad;
        this.fecha = new Date().toLocaleString();
        this.leido = false;
    }

    toHTML(index) {
        return `
        <div class="ticket ${this.prioridad} ${this.leido ? "leido" : ""}">
            <h5>${this.nombre} <small class="text-muted">(${this.email})</small></h5>
            <p>${this.texto}</p>
            <small>Fecha: ${this.fecha}</small><br>
            <small>Prioridad: <strong>${this.prioridad}</strong></small>

            <div class="mt-2">
                <button class="btn btn-sm btn-primary" onclick="toggleLeido(${index})">Marcar leído</button>
                <button class="btn btn-sm btn-danger" onclick="eliminar(${index})">Eliminar</button>
            </div>
        </div>`;
    }
}

let tickets = [];
let urgentes = 0;

document.getElementById("ticketForm").addEventListener("submit", function(e){
    e.preventDefault();
    limpiarErrores();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const prioridad = document.getElementById("prioridad").value;
    const mensaje = document.getElementById("mensaje").value.trim();

    let valido = validar(nombre, email, mensaje);

    if(!valido) return;

    const nuevo = new Message(nombre, email, mensaje, prioridad);

    if (prioridad === "alta") urgentes++;

    tickets.unshift(nuevo);
    guardarLocal();
    renderTickets();
});

function validar(nombre, email, mensaje){
    let ok = true;

    if(nombre.length < 3){
        document.getElementById("errNombre").textContent = "El nombre debe tener mínimo 3 caracteres.";
        ok = false;
    }

    if(!email.includes("@") || !email.includes(".")){
        document.getElementById("errEmail").textContent = "Ingresa un email válido.";
        ok = false;
    }

    if(mensaje.length < 10){
        document.getElementById("errMensaje").textContent = "Mínimo 10 caracteres.";
        ok = false;
    }

    return ok;
}

function limpiarErrores(){
    document.getElementById("errNombre").textContent = "";
    document.getElementById("errEmail").textContent = "";
    document.getElementById("errMensaje").textContent = "";
}

function renderTickets(){
    const cont = document.getElementById("listaTickets");
    cont.innerHTML = "";

    for(let i = 0; i < tickets.length; i++){
        cont.innerHTML += tickets[i].toHTML(i);
    }

    document.getElementById("urgentes").textContent = urgentes;
}

function eliminar(index){
    if(tickets[index].prioridad === "alta") urgentes--;
    tickets.splice(index, 1);
    guardarLocal();
    renderTickets();
}

function toggleLeido(index){
    tickets[index].leido = !tickets[index].leido;
    guardarLocal();
    renderTickets();
}

function guardarLocal(){
    localStorage.setItem("tickets", JSON.stringify(tickets));
    localStorage.setItem("urgentes", urgentes);
}

function cargarLocal(){
    tickets = JSON.parse(localStorage.getItem("tickets")) || [];
    urgentes = Number(localStorage.getItem("urgentes")) || 0;
    renderTickets();
}

cargarLocal();
