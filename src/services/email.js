const nodemailer = require("nodemailer");

class EmailManager {

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: "saidmanlucas.p@gmail.com",
                pass: "shev mchc outx zbut"
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    }

    async enviarCorreoCompra(email, first_name, ticket) {
        try {
            const mailOptions = {
                from: "Coder Test <saidmanlucas.p@gmail.com>",
                to: email,
                subject: "Confirmacion de compra",
                html: `
                        <h1> Confirmación de compra </h1>
                        <p>Gracias por tu compra, ${first_name} </p>
                        <p>El número de tu orden es: ${ticket} </p>
                `
            }
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.log("Error al enviar el mail");
        }
    }

    async enviarCorreoRestablecimiento(email, first_name, token) {
        try {
            const mailOptions = {
                from: "Coder Test <saidmanlucas.p@gmail.com>",
                to: email,
                subject: "Restablecimiento de contraseña",
                html: `
                        <h1> Restablecimiento de contraseña </h1>
                        <p>Hola ${first_name} ! </p>
                        <p>Pediste restablecer la contraseña. Te enviamos el codigo de confirmacion: </p>
                        <strong> ${token} </strong>
                        <p> Este codigo expira en una  hora </p>
                        <a href="http://localhost:8080/password"> Restablecer contraseña </a>

                `
            }
            await this.transporter.sendMail(mailOptions);


        } catch (error) {
            console.log("Error al enviar el correo de restablecimiento");
        }
    }

}


module.exports = EmailManager;