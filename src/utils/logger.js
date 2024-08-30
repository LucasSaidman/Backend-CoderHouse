const winston = require('winston');
const { node_env } = require("../config/config.js");


//Niveles:
const niveles = {
    nivel: {
        fatal: 0, 
        error: 1, 
        warning: 2,
        info: 3, 
        http: 4, 
        debug: 5
    },
    colores: {
        fatal: "red", 
        error: "red", 
        warning: "yellow", 
        info: "green", 
        http: "magenta", 
        debug: "blue"
    }
}


//Logger para desarrollo: 
const loggerDesarrollo = winston.createLogger({
    levels: niveles.nivel, 
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({colors: niveles.colores}),
                winston.format.simple()
            )
        })
    ]
})


//Logger para produccion: 
const loggerProduccion = winston.createLogger({
    levels: niveles.nivel, 
    transports: [
        new winston.transports.File({
            level: "error",
            filename: "./errors.log"
        })
    ]
})


//Determinar que logger usar de acuerdo a la variable de entorno (.env). 
//Ternario: 
const logger = node_env === "produccion" ? loggerProduccion : loggerDesarrollo; 


//Middleware:
const addLogger = (req, res, next) => {
    req.logger = logger; 
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
}


//Exportamos:
module.exports = addLogger;