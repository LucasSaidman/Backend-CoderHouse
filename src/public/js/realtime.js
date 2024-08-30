const socket = io();
const role = document.getElementById("role").textContent;
const email = document.getElementById("email").textContent;

socket.on("productos", (data) => {
    renderProductos(data);
})

//Función para renderizar nuestros productos: 

const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";
    
    productos.docs.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = ` 
                        <p> ${item.title} </p>
                        <p> ${item.price} </p>
                        <button class="btn btn-danger btn-delete" data-id="${item._id}"> Eliminar </button>
                        `;

        contenedorProductos.appendChild(card);
        
        //Agregamos el evento al boton de eliminar:
        card.querySelector("button").addEventListener("click", () => {
            if (role === "premium" && item.owner === email) {
                eliminarProducto(item._id);
            } else if (role === "admin") {
                eliminarProducto(item._id);
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No tenes permiso para borrar ese producto",
                })
            }
        })
    })
}


function eliminarProducto(pid) {
    socket.emit("eliminarProducto", pid);
}

//Agregamos productos del formulario: 
document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
})

const agregarProducto = () => {
    const role = document.getElementById("role").textContent;
    const email = document.getElementById("email").textContent;
    
    const owner = role === "premium" ? email : "admin";
    
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
        owner
    };
    
    socket.emit("agregarProducto", producto);
}