import { MailService } from '@sendgrid/mail'
import logger from '../../utils/logger'
import { environment } from '../../config/environment'

export enum MailingTypeEnum {
  CONTACT='',
  ACCOUNT_CONFIRMATION='',
  ACCOUNT_UPDATE='',
  CONFIRM_SET_PASSWORD='',
}

const client = new MailService()
client.setApiKey(environment.SENDGRID_KEY)

export async function sendEmail(email: string, type: MailingTypeEnum, emailSubject: string, data: object): Promise<boolean> {
  const sendEmailResponse = await executeEmail(email, emailSubject, type, data)
  return sendEmailResponse
}

async function executeEmail(email: string, emailSubject: string, templateId: string, data: object): Promise<boolean> {
  try {
    const sendResponse = await client.send({
      from: 'Rafael Vilarinho <vilarinho@ravitecnologia.com.br>',
      to: email,
      subject: `${emailSubject}`,
      dynamicTemplateData: { ...data, emailSubject },
      templateId
    })

    return !!sendResponse
  } catch (error) {
    logger.error('', error)
  }

  return false
}