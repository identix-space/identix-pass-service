export type TUserCreate = {
  email: string
  address?: string | null
  nonce?: string | null
  lastActive?: Date | null
}
export type TUserUpdate = {
  email: string
  address?: string | null
  nonce?: string | null
  lastActive?: Date | null
}