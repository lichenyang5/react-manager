import type { RefObject } from 'react'
import type { User } from './api'
export type IAction = 'create' | 'edit' |'delete'
export interface ImodalProp<T = User.UserItem>{
  mRef: RefObject<
  {open:(type:IAction,data?:T) =>void}| null
  >
  update:()=>void
}
export interface IDetailProp {
  mRef: RefObject<{ open: (orderId: string) => void } | undefined>
}
