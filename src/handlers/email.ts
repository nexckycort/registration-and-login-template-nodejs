import nodemailer, { SendMailOptions } from 'nodemailer'
import colors from 'colors'

import { email } from 'config'
import Logger from 'helpers/logger'

const transporter = nodemailer.createTransport({
  host: email.host,
  port: email.port,
  auth: {
    user: email.user,
    pass: email.password
  }
} as any)

export const SendEmail = (Options: SendMailOptions): void => {
  const optionsEmail: SendMailOptions = Object.assign(Options, { from: 'api <noreplay@api.com>' })

  transporter.sendMail(optionsEmail, (error, info) => {
    if (error !== null) {
      Logger.error(colors.red(`Error occurred while sending an email to ${optionsEmail.to}`), error.message)
      return
    }

    Logger.info(colors.blue.bold.italic(`Message sent a ${optionsEmail.to} successfully!`))
    transporter.close()
  })
}
