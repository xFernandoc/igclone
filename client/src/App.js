import React, {useEffect, createContext,useReducer,useContext} from 'react';
import NavBar from './components/navbar'
import './App.css'
import {BrowserRouter, Route,Switch,useHistory} from 'react-router-dom'
import Login from './components/views/Login'
import Registro from './components/views/Registro'
import Perfil from './components/views/Perfil'
import Inicio from './components/views/Inicio'
import CreatePost from './components/views/CreatePost'
import PerfilUser from './components/views/PerfilUsuario'
import FollowingPosts from './components/views/PostFollowing'
import {reducer,initialState} from './reducers/userReducer'
import io from 'socket.io-client'

export const UserContext = createContext()
export const socket = io('localhost:5000')
  
const Routing = ()=>{
  const history = useHistory()
  const {dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type : "USER",payload : user})
    }else{
      history.push('/login')
    }
  },[])
  return(
    <Switch>
      <Route exact path="/" component={Inicio}/>
      <Route path="/login" component={Login}/>
      <Route path="/registro" component={Registro}/>
      <Route exact path="/perfil" component={Perfil}/>
      <Route path="/publicar" component={CreatePost}/>
      <Route path="/perfil/:userid" component={PerfilUser}/>
      <Route path="/myfollowingspost" component={FollowingPosts}/>
    </Switch>
  )
}

function App() {
  const [state,dispatch]  = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <NavBar/>
        <Routing/>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
