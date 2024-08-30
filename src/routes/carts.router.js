const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/CartManager.js");
const authMiddleware = require("../middleware/authmiddleware.js");
const cartManager = new CartManager();


router.use(authMiddleware);

router.post("/", cartManager.nuevoCarrito);
router.get("/:cid", cartManager.obtenerProductosDeCarrito);
router.post("/:cid/product/:pid", cartManager.agregarProductoEnCarrito);
router.delete('/:cid/product/:pid', cartManager.eliminarProductoDeCarrito);
router.put('/:cid', cartManager.actualizarProductosEnCarrito);
router.put('/:cid/product/:pid', cartManager.actualizarCantidad);
router.delete('/:cid', cartManager.vaciarCarrito);
router.post('/:cid/purchase', cartManager.finalizarCompra);


module.exports = router;