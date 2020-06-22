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
  const navelement = useRef(null)

  useEffect(()=>{
    M.Modal.init(buscador.current)
    M.Sidenav.init(navelement.current)
  },[])
  const renderList = ()=>{
    if(state){
      return[
          <li key="buscador">
            <i data-target="modal1" 
              className="large material-icons modal-trigger" 
              style={{color :"black", marginRight: "1rem", cursor : "pointer"}}>search</i></li>,
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
  const listNav = ()=>{
    if(state){
      return [
        <li key="perfil_m">
          <div className="user-view">
            <div className="background">
              <img className="responsive-img" src="https://res.cloudinary.com/dnayrcm6i/image/upload/v1592711204/fondo_kekyey.jpg"/>
            </div>
            <a href="#user"><img className="circle" src={state ? state.pic : ""} alt="perfil"/></a>
            <a href="#name"><span className="white-text name">{state ? state.name : ""}</span></a>
            <a href="#email"><span className="white-text email">{state ? state.email : ""}</span></a>
          </div>
        </li>,
        <li key="perfil"><Link to="/perfil" className="sidenav-close"><i className="material-icons black-text">account_circle</i>Perfil</Link></li>,
        <li key="publicar"><Link to="/publicar" className="sidenav-close"><i className="material-icons black-text">add_circle</i>Nueva publicación</Link></li>,
        <li key="seguidores"><Link to="/myfollowingspost" className="sidenav-close"><i className="material-icons black-text">sentiment_very_satisfied</i>Siguiendo</Link></li>,
        <li key="cerrar" className="fondo sidenav-close"><div className="divider"></div><a onClick={()=>{
          localStorage.clear()
          dispatch({type : "CLEAR"})
          history.push("/login")
        }}><i className="material-icons black-text">directions_run </i> Cerrar Sesión</a></li>
      ]
    }else{
      return [
        <li key="login"><Link to="/login" className="sidenav-close"><i className="material-icons black-text">account_circle</i>Iniciar sesión</Link></li>,
        <li key="registro"><Link to="/registro" className="sidenav-close"><i className="material-icons black-text">add_circle</i>Unirte</Link></li>,
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
      <div>
        <div className="navbar-fixed">
          <nav  className="nav-wrapper white">
            <Link to={state?"/":"/login"} className="brand-logo left">Instagram</Link>
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                {renderList()}
              </ul>
              <a href="#!" data-target="slide-out" className=" right transparent sidenav-trigger hide-on-large-only"><i className="material-icons" style={{color : "black"}}>menu</i></a>
          </nav>
        </div>
        <ul ref={navelement} id="slide-out" className="sidenav hide-on-large-only">
          {listNav()}
        </ul>
        <div ref={buscador} id="modal1" className="modal" style={{color : "black"}}>
          <div className="container">
            <div className="modal-content">
              <input 
                type="text"
                placeholder="Buscar..."
                value={buscar}
                onChange={(e)=>{
                  getDataApi(e.target.value)
                }}
              />
              <ul className="collection">
                {
                  userDetails.map((item)=>{
                    return (
                      <Link to={state._id===item._id ? "/perfil" :  `/perfil/${item._id}`} key={item._id} onClick={()=>{
                        M.Modal.getInstance(buscador.current).close()
                        setBuscar('')
                        setDetails([])
                      }}>
                        <li className="collection-item avatar">
                          <img src={item.pic} alt="avatar" className="circle"/>
                          <span className="title">{item.name}</span>
                          <p>{item.email}</p>
                        </li>
                      </Link>
                    )
                  })
                } 
              </ul>
            </div>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>{
              setDetails([])
              setBuscar("")
            }}>Cerrar</button>
          </div>
        </div>
      </div>
    )
}
export default NavBar