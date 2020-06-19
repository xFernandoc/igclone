import React, {useContext,useRef,useEffect, useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'
const NavBar = ()=>{
  const buscador = useRef(null)
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  const [buscar,setBuscar] = useState('')
  const [userDetails, setDetails] = useState([])
  useEffect(()=>{
    M.Modal.init(buscador.current)
  },[])
  const renderList = ()=>{
    if(state){
      return[
        <li key="buscador"><i data-target="modal1" className="large material-icons modal-trigger" style={{color :"black", marginRight: "1rem", cursor : "pointer"}}>search</i></li>,
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
  const getDataApi =  (user) =>{
    setBuscar(user)
    fetch('/buscar-users',{
      method : "POST",
      headers : {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${localStorage.getItem("jwt")}`
      },
      body : JSON.stringify({query : user})
    }).then(res=>res.json())
    .then(users => {
      setDetails(users)
    })
  }
    return (
        <nav>
        <div className="nav-wrapper white" >
          <Link to={state?"/":"/login"} className="brand-logo left">Instagram</Link>
          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
        </div>
        <div id="modal1" className="modal" ref={buscador} style={{color : "black"}}>
          <div className="modal-content">
            <input
              type="text"
              placeholder = "Buscar personas"
              value = {buscar}
              onChange = {(e)=>getDataApi(e.target.value)}
            />
            <ul className="collection">
              {
                userDetails.map((item)=>{
                  return <Link key={item._id} to={item._id === state._id ? '/perfil' : `/perfil/${item._id}`} onClick={(e)=>{
                    M.Modal.getInstance(buscador.current).close()
                    setBuscar("")
                    setDetails([])
                  }}> <li  className="collection-item">{item.name}</li></Link>
                })
              }
            </ul>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>{
              setBuscar("")
              setDetails([])
            }}>Cerrar</button>
          </div>
        </div>
      </nav>
    )
}
export default NavBar