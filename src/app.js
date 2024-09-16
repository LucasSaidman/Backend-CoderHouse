const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const cors = require("cors");
const path = require('path');
const addLogger = require("./utils/logger.js");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');
const configObject = require("./config/config.js");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const fakerRouter = require("./routes/faker.router.js");

//const manejadorError = require("./middleware/error.js");


const app = express();
const PUERTO = process.env.PORT || 8080;
const connection = mongoose.connect(configObject.mongo_url);
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion del ecommerce Game Over", 
            description: "Ecommerce de venta de Hardware de computadoras"
        }
    }, 
    apis: ["./src/docs/**/*.yaml"]
}
const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: "http://localhost:8080",
    credentials: true
}));
app.use(addLogger);


//Passport
app.use(passport.initialize());
initializePassport(); 
app.use(cookieParser());


//AuthMiddleware
const authMiddleware = require("./middleware/authmiddleware.js");
app.use(authMiddleware);


//Configuramos Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api", fakerRouter);
app.use("/", viewsRouter);
//app.use(manejadorError);

//RUTA PARA TESTEAR WINSTON: 
app.get("/loggertest", (req, res) => {
    req.logger.debug("Mensaje DEBUG");
    req.logger.http("Mensaje HTTP"); 
    req.logger.info("Mensaje INFO"); 
    req.logger.warning("Mensaje WARNING"); 
    req.logger.error("Mensaje ERROR");
    req.logger.fatal("Mensaje FATAL");

    res.send("Logs generados");
});


//Listen
const httpServer = app.listen(PUERTO, () => {

    console.log(`Escuchando en el puerto http://localhost:${PUERTO}`);

});


//WebSockets
const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(httpServer);