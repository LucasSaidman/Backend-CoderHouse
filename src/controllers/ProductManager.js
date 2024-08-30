const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();

class ProductManager {
    async addProduct(req, res) {
        const nuevoProducto = req.body;
        try {
            await productRepository.agregarProducto(nuevoProducto);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async getProducts(req, res) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;

            const products = await productRepository.obtenerProductos(limit, page, sort, query);
           
            res.json(products);
        } catch (error) { 
            res.status(500).send("Error");
        }
    }

    async getProductById(req, res) {
        const id = req.params.pid;
        try {
            const buscado = await productRepository.obtenerProductoPorId(id);
            if (!buscado) {
                return res.json({
                    error: "Producto no encontrado"
                });
            }
            res.json(buscado);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async updateProduct(req, res) {
        try {
            const id = req.params.pid;
            const productoActualizado = req.body;

            const resultado = await productRepository.actualizarProducto(id, productoActualizado);
            res.json(resultado);
        } catch (error) {
            res.status(500).send("Error al actualizar el producto");
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.pid;
        const userRole = req.user.role; 

        try {
            const borrarProducto = await productRepository.eliminarProducto(id);
            if(!borrarProducto) {
                return res.status(404).send({message: "Producto no encontrado"});
            }

            //Verificamos el rol del usuario
            if (userRole === "premium") {
                //Si es premium validamos que el usuario sea el propietario del producto
                    if (borrarProducto.owner !== req.user.email) {
                        return res.status(403).send({ message: "No eres el propietario del producto" });
                    }
    
                } else if (userRole !== "admin") {
                    //Si es usuario no es admin ni premium denegamos el acceso
                    return res.status(403).send({ message: "No tienes permiso para eliminar este producto" });
                }
    
                //Eliminamos el producto
                await productRepository.eliminarProducto(id);
                return res.status(200).send({ message: "Producto eliminado correctamente", product: eliminarProducto });

        } catch (error) {
            res.status(500).send("Error al eliminar el producto");
        }
    }

}

module.exports = ProductManager;