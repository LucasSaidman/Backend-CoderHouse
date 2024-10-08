const socket = require("socket.io");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository(); 
const MessageModel = require("../models/message.model.js");

class SocketManager {
    constructor(httpServer) {
        this.io = socket(httpServer);
        this.initSocketEvents();
    }

    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("Un cliente se conectó");
            
            this.io.emit("productos", await productRepository.obtenerProductos() );

            socket.on("eliminarProducto", async (pid) => {
                await productRepository.eliminarProducto(pid);
                console.log(pid);
                this.emitUpdatedProducts(socket);
            });

            socket.on("agregarProducto", async (producto) => {
                await productRepository.agregarProducto(producto);
                console.log(producto);
                this.emitUpdatedProducts(socket);
            });

            socket.on("message", async data => {
                await MessageModel.create(data);
                const messages = await MessageModel.find();
                socket.emit("message", messages);
            });
        });
    }

    async emitUpdatedProducts(socket) {
        socket.emit("productos", await productRepository.obtenerProductos());
    }
}

module.exports = SocketManager;