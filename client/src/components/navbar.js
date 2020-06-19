import React, {useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
const NavBar = ()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  const renderList = ()=>{
    if(state){
      return[
        <li key="perfil"><Link to="/perfil">Perfil</Link></li>,
        <li key="publicar"><Link to="/publicar">Nueva publicación</Link></li>,
        <li key="postsFollowers"><Link to="/myfollowingspost">Siguiendo</Link></li>,
        <li key="cerrar">
          <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>{
            localStorage.clear()
            dispatch({type : "CLEAR"})
            history.push("/login")
          }}>Cerrar Sesión</button>
        </li>
      ]
    }else{
      return [
        <li key="login"><Link to="/login">Login</Link></li>,
        <li key="registro"><Link to="/registro">Registrarse</Link></li>
      ]
    }
  }
    return (
        <nav>
        <div className="nav-wrapper white">
          <Link to={state?"/":"/login"} className="brand-logo left">Instagram</Link>
          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
        </div>
      </nav>
    )
}
export default NavBar