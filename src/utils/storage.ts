/**
 localStorage的封装
 */
export default {
  /*
    storage存储
    @param key {string} 参数名称
    @param value {any} 写入值
  */
  set(key:string,value:any){
    localStorage.setItem(key,JSON.stringify(value))
  },
  /*
    storeage读取
    key 参数名称
    返回值 storage值
  */
  get(key:string){
   const value =  localStorage.getItem(key)
   if(!value) return ''
   try{
    return JSON.parse(value)
   }catch{
    return value
   }
  },
  /*
    删除storage值
    参数 key {string} 参数名称
  */
  remove(key:string){
    localStorage.removeItem(key)
  },
  /*
    清空所以
  */
  clear(){
    localStorage.clear()
  }
}
