import nodemailer, { Transporter } from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';

class SendMailService {
    private client: Transporter;
    constructor() {
        nodemailer.createTestAccount().then((account) => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host, 
                port: account.smtp.port, 
                secure: account.smtp.secure,
                tls:{
                    rejectUnauthorized: false
                },
                auth: {
                  user: account.user, 
                  pass: account.pass, 
                }
            });

            this.client = transporter;
        })
        .catch(function(e) {
            console.log(e);
        });
    }

    async execute(to: string, subject: string, variables: object, path: string){
        // Configurando caminho para compilar o arquivo de npsMail para a enquete        
        const templateFileContent = fs.readFileSync(path).toString("utf8");

        // compila, através do handlebars, o arquivo template da enquete lido
        const mailTemplateParse = handlebars.compile(templateFileContent)

        // Manda o valor das variáveis do arquivo template do email
        const html = mailTemplateParse(variables);

        const message = await this.client.sendMail({
            to,
            subject,
            html, // Recebe o HTML já parseado com o template novo da enquete
            from: "NPS <noreply@nps.com.br>"
        });

        console.log('Message sent: %s', message.messageId);        
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }    
}

export default new SendMailService();