import { history } from './history'
const routerByIdObj =(pathname)=> {
    if(localStorage.getItem('XIAOHUOLONG_APP_BTN_LIST')!==null){
          const  routerList=JSON.parse(localStorage.getItem('XIAOHUOLONG_APP_BTN_LIST')) 

  for(let i = 0; i < routerList.length; i++){
      if(routerList[i] === pathname){
        
         return true
      }
   }
    return false
    }else{
        window.localStorage.clear();
        history.push('/login')
    }


}

export default routerByIdObj