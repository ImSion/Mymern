import mailgun from "mailgun-js";

const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

export const sendEmail = async (to, subject, htmlContent) => {
    const data = {
        from: 'POVblogs <noreply@yourdomain.com>', // il mittente della mail
        to,
        subject,
        html: htmlContent
    }
    try {
        console.log('Tentativo di invio email con i seguenti dati:', { to, subject });
        const response = await mg.messages().send(data)
        console.log('Email inviata con successo', response);
        return response
    } catch(err) {
        console.error('Errore nell\'invio della mail:', err);
        throw err
    }
}