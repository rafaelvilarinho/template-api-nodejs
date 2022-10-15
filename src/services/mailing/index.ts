import nodemailerClient from './nodemailer'

export enum MailingType {
  SIGNUP_CONFIRM = './src/services/mailing/templates/signup-confirm.html',
  PASSWORD_CHANGE_REQUEST = './src/services/mailing/templates/password-request.html',
}

export async function sendEmail (
  recipients: string[],
  subject: string,
  emailType: MailingType,
  templateVariables?: Record<string, unknown>
): Promise<boolean> {
  const mailingClient = await nodemailerClient.getMailingClient()
  const result = await mailingClient.sendEmail(
    recipients,
    subject,
    emailType,
    templateVariables || {}
  )

  return result
}