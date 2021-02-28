import {instance, ResponseType} from "./todoListAPI";


export type MineData = {
  id: number,
  email: string,
  login: string
}
export type AuthLoginType = {
  email: string,
  password: string,
  rememberMe: boolean,
  captcha?: string
}

export const authAPI = {
  login(data: AuthLoginType) {
    return instance.post<ResponseType<{userId: number}>>('auth/login', data)
  },
  me() {
    return instance.get<ResponseType<MineData>>('auth/me')
  },
  logout() {
    return instance.delete<ResponseType>('auth/login')
  }
}
