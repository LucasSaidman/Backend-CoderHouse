const express = require("express");
const generarProductos = require("../utils/faker.js");
const FakerManager = require('../controllers/FakerManager.js');

const router = express.Router();
const fakerManager = new FakerManager();


router.get("/mockingproducts", async (req, res) => {

    try {
        const products = Array.from({ length: 100 }, generarProductos);

        await fakerManager.init();

        for (const product of products) {
            await fakerManager.addProductFromFaker(
                product.title,
                product.description,
                product.price,
                product.stock
            );
        }

        const storedProducts = await fakerManager.getProducts();
        res.render('mockingproducts', { products: storedProducts
        });

    } catch (error) {

        console.error("Error al obtener productos:", error);
        res.status(500).send("Error al obtener productos");

    }

})

module.exports = router; 