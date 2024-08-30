const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/ProductManager.js");
const productManager = new ProductManager();
const passport = require("passport");


router.get("/", productManager.getProducts);
router.get("/:pid", productManager.getProductById);
router.post("/", passport.authenticate("jwt", { session: false }), productManager.addProduct);
router.put("/:pid", productManager.updateProduct);
router.delete("/:pid", productManager.deleteProduct);

module.exports = router;

//Productos para Postman:

//Agregar Productos
/*
{
    "title": "Teclado",
    "description": "Logitech G413 Carbon",
    "price": 55000,
    "thumbnail": "https://d2r9epyceweg5n.cloudfront.net/stores/001/715/976/products/teclado-logitech1-a0d0f03734ef17c46216506377238422-1024-1024.jpg",
    "code": "G413",
    "stock": 15
}
{
    "title": "Microfono",
    "description": "HyperX Quadcast",
    "price": 78000,
    "thumbnail": "https://cellplay.com.ar/img/Public/producto-137331-0.jpg",
    "code": "HX-QC",
    "stock": 10
}
*/

//Actualizar Producto
/*
{
    "title": "Microfono",
    "description": "HyperX Quadcast",
    "price": 500000,
    "thumbnail": "https://cellplay.com.ar/img/Public/producto-137331-0.jpg",
    "code": "HX-QC",
    "stock": 1
}
*/