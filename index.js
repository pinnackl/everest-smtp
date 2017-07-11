const nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var express = require('express');
var bodyParser = require('body-parser');

var options = {
    viewEngine: {
        extname: '.hbs',
        layoutsDir: 'views/email/',
        defaultLayout: 'template',
        partialsDir: 'views/partials/'
    },
    viewPath: 'views/email/',
    extName: '.hbs'
};

var app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(5000, function () {
    console.log('Everest Mailer API listening on port 5000!');
});

app.post('/send/:route', bodyParser.urlencoded(true), function (req, res) {
    var route = req.params.route;
    var data = req.body;

    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "pinnakle.work@gmail.com",
            pass: "Icge0ylb!"
        }
    });
    transporter.use('compile', hbs(options));

    var mailOptions = {};

    switch (route) {
        case 'inscription':
            mailOptions = {
                from: "pinnakle.work@gmail.com",
                to: data.recipient,
                subject: data.subject,
                template: route + '/' + route + '.body',
                context: {
                    username: data.username
                }
            }
            break;
        case 'contact':
            mailOptions = {
                from: "pinnakle.work@gmail.com",
                to: data.recipient,
                subject: data.subject,
                template: data.request + '/' + data.request + '.body',
                context: {
                    username: data.username,
                    message: data.message
                }
            }
            break;
        default:
            return res.status(404).end('Not Found');
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return res.status(400).end("Error during sending email");
        } else {
            console.log('Message %s sent: %s', info.messageId, info.response);
            transporter.close();
            return res.status(200).end("Email sent");
        }

    });

});

