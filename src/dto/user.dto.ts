export class UpdateUserDto {
  name?: string
  address?: string
  phone_no?: string
  password?: string
}

export class ChangePassword {
  email: string
  password_old: string
  password_new: string
}