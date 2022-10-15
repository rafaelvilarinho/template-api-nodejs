import { environment, isDev } from '../../../config/environment';
import nodemailer from 'nodemailer'
import handlebars from 'handlebars'
import fs from 'fs'
import logger from '../../../utils/logger';

function send (transporter: nodemailer.Transporter) {
  return async (to: string[], subject: string, templateFileURL: string, templateVariables: Record<string, unknown>): Promise<boolean> => {
    try {
      const templateFile = fs.readFileSync(templateFileURL, "utf8");
  
      const info = await transporter.sendMail({
        from: `"${environment.MAILING_USER_NAME}" <${environment.MAILING_USER_EMAIL}>`,
        to: isDev() ? `"${environment.MAILING_TESTER_NAME}" <${environment.MAILING_TESTER_EMAIL}>` : to.join(", "),
        subject,
        html: handlebars.compile(templateFile.toString())(templateVariables),
      });
      
      logger.debug(`Message sent: ${info.messageId}`);
      logger.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  
      return true
    } catch (error) {
      logger.error(error)

      return false
    }
  }
}

export async function getMailingClient() {
  let account

  if (isDev()) {
    const {user, pass} = await nodemailer.createTestAccount();
    account = {
      user,
      pass,
      host: "smtp.ethereal.email",
      port: 587,
      isSecure: false,
    }
  } else {
    account = {
      host: environment.MAILING_HOST,
      port: environment.MAILING_PORT,
      user: environment.MAILING_USER,
      pass: environment.MAILING_PASS,
      isSecure: environment.MAILING_SECURE,
    }
  }
  
  const transporter = nodemailer.createTransport({
    host: account.host,
    port: account.port,
    secure: account.isSecure,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });

  return {
    sendEmail: send(transporter)
  }
}

export default {
  getMailingClient
}