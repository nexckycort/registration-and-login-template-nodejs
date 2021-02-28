export interface ReqUser {
  name: string
  email: string
  password: string
}

export interface UserRecord extends ReqUser {
  id: number
  active: boolean
  hash: string
}
