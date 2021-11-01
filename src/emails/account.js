const mailgun = require("mailgun-js");
const DOMAIN = "sandbox0b762e79402741bba6068d6b0ceb9b41.mailgun.org";
const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN});

const sendWelcomeEmail = (email, name) => {
    mg.messages().send({
        to: email,
        from: 'robbrons35@gmail.com',
        subject: 'Thanks for joining in',
        text: `Welcome to the app, ${name}.`
    })
}
const sendDeletionEmail = (email, name) => {
    mg.messages().send({
        to: email,
        from: 'robbrons35@gmail.com',
        subject: 'Thanks for using our services',
        text: `We're sad to see you go, ${name}. Was there something you disliked? Please, leave feedback.`
    })
}
module.exports = {
    sendWelcomeEmail,
    sendDeletionEmail
}