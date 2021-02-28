import jwt from 'jsonwebtoken'
import colors from 'colors'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { SendMailOptions } from 'nodemailer'

import UsersModel from 'models/user/users.model'
import Logger from 'helpers/logger'
import { secretKey } from 'config'
import { ReqUser, UserRecord } from 'interfaces/user.interfaces'
import { confirmAccountHtml, confirmAccountText } from 'helpers/templates/emails/confirmAccount'
import { SendEmail } from 'handlers/email'

class UserService {
  private static _instance: UserService
  private readonly usersModel!: typeof UsersModel
  private constructor() {
    this.usersModel = UsersModel
  }

  public static get instance(): UserService {
    if (UserService._instance === undefined) {
      UserService._instance = new UserService()
    }
    return UserService._instance
  }

  save = async (reqUser: ReqUser, host: string): Promise<UserRecord> => {
    try {
      const passwordHash = await bcrypt.hash(reqUser.password, 10)
      reqUser.password = passwordHash

      const hash = crypto.randomBytes(20).toString('hex')
      Object.assign(reqUser, { hash })

      const url = [host, 'confirm-account', hash].join('/')
      const optionsEmail: SendMailOptions = {
        to: reqUser.email,
        subject: 'Confirma tu cuenta',
        text: confirmAccountText(url),
        html: confirmAccountHtml(url)
      }

      SendEmail(optionsEmail)

      const user = await this.usersModel.create<UserRecord>(reqUser)
      return user
    } catch (error) {
      Logger.error(colors.red('Error UserService save '), error)
      throw new Error('TECHNICAL ERROR')
    }
  }

  findByEmail = async (email: string): Promise<UserRecord | undefined> => {
    try {
      const user = await this.usersModel.findOne<UserRecord>({ where: { email } })
      return user
    } catch (error) {
      Logger.error(colors.red('Error UserService save '), error)
      throw new Error('TECHNICAL ERROR')
    }
  }

  comparePassword = async (passwordToCompare: string, originalPassword: string): Promise<boolean> => {
    try {
      const data = await bcrypt.compare(passwordToCompare, originalPassword)
      return data
    } catch (e) {
      Logger.error(colors.red('Error UserService comparePassword '), e)
      throw new Error('TECHNICAL ERROR')
    }
  }

  signToken = (data: Record<string, unknown>, expiresIn = '24h'): string => {
    return jwt.sign(data, secretKey, { expiresIn })
  }

  validateAccountByHash = async (hash: string): Promise<boolean | string> => {
    try {
      const { active } = await this.usersModel.findOne<{ active: boolean | undefined }>({ where: { hash }, attributes: ['active'] })
      if (active === undefined) return 'account not valid'
      return active
    } catch (e) {
      Logger.error(colors.red('Error UserService validateAccountByHash '), e)
      throw e
    }
  }

  confirmAccount = async (hash: string): Promise<void> => {
    try {
      await this.usersModel.update({ o: { active: true }, where: { hash } })
    } catch (e) {
      Logger.error(colors.red('Error UserService confirmAccount '), e)
      throw e
    }
  }

  /* compareHash = async (hash: string): Promise<number | undefined> => {
    try {
      const match = await this.usersModel.compareHash(hash)
      return match
    } catch (e) {
      Logger.error(colors.red('Error UserService compareHash '), e)
      throw e
    }
  } */

  /*  sendEmailRestorePassword = async (email: string, user: string): Promise<void> => {
    try {
      const hash = crypto.randomBytes(20).toString('hex')

      const oneHour = 3600000
      const data = {
        token: hash,
        expira_token: (Date.now() + oneHour)
      }
      await usersModel.update({ o: data, where: { usuario: user } })
      const url = [urlClient, 'restablecer-contraseña', hash].join('/')
      const optionsEmail: SendMailOptions = {
        to: email,
        subject: 'Restablecer Contraseña Edukar',
        // TODO: restorePasswordText
        text: 'restorePasswordText(url)',
        html: restorePasswordHtml(url)
      }

      SendEmail(optionsEmail)
    } catch (e) {
      Logger.error(colors.red('Error restorePassword save '), e)
      throw new Error('TECHNICAL ERROR')
    }
  }

  validateTokenRestorePassword = async (token: string): Promise<boolean> => {
    try {
      const user = await usersModel.findOne({ where: { token: token } })
      if (user === undefined) return false
      const expiresIn = +user.expira_token - Date.now()
      return expiresIn >= 0
    } catch (e) {
      Logger.error(colors.red('Error UserService validateAccountByUser '), e)
      throw e
    }
  }

  restorePassword = async (password: string, token: string): Promise<boolean> => {
    try {
      const passwordHash = await bcrypt.hash(password, 10)
      await usersModel.update({ o: { clave: passwordHash, token: null }, where: { token } })
      return true
    } catch (e) {
      Logger.error(colors.red('Error restorePassword validateAccountByUser '), e)
      throw e
    }
  }

  verifyToken = (token: string): any => {
    return jwt.verify(token, secretKey)
  } */
}

export default UserService.instance
