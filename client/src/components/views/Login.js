import React , {useState, Fragment,useContext} from 'react'
import { Link, useHistory } from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'

const Login = ()=>{
    const {dispatch} = useContext(UserContext)
    const history = useHistory()
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")

    const envio = (e) =>{
        e.preventDefault()
        const loader = document.getElementById('loader')
        loader.style.display="flex";
            const data = JSON.stringify({
                email,
                password
            })
            fetch('/login',{
                method : "post",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : data
            }).then(res => res.json())
            .then(data =>{
                loader.style.display="none";
                if(data.error){
                    M.toast({html : data.error,classes : "#d32f2f red darken-2"})
                }else{
                    localStorage.setItem("jwt",data.token)
                    localStorage.setItem("user",JSON.stringify(data.user))
                    dispatch({
                        type : "USER",
                        payload : data.user
                    })
                    M.toast({html : "Bienvenido",classes : "#388e3c green darken-2"})
                    history.push('/perfil')
                }
            })
    }
    return(
        <Fragment>
            <div id="loader">
                <div className="preloader-wrapper big active">
                    <div className="spinner-layer spinner-blue-only">
                    <div className="circle-clipper left">
                        <div className="circle"></div>
                    </div><div className="gap-patch">
                        <div className="circle"></div>
                    </div><div className="circle-clipper right">
                        <div className="circle"></div>
                    </div>
                    </div>
                </div>
            </div>
            <form className="mycard" onSubmit={envio}>
                <div className="card auth-card">
                    <h2 className="titulo">Instagram</h2>
                    <div className="row">
                        <div className="col s12">
                            <div className="input-field">
                                <i className="material-icons prefix l_icon">email</i>
                                <input value={email} onChange={(e)=>setEmail(e.target.value)} id="i_email" type="email" className="validate"/>
                                <label htmlFor="i_email">Correo</label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <div className="input-field">
                                <i className="material-icons prefix l_icon">vpn_key</i>
                                <input value={password} onChange={(e)=>setPassword(e.target.value)} id="i_clave" type="password" className="validate"/>
                                <label htmlFor="i_clave">Clave</label>
                            </div>
                        </div>
                    </div>
                    <button id="btn_r" type="submit" className="btn waves-effect #1e88e5 blue darken-1">
                        Iniciar sesión
                    </button>
                    <h5 >
                        <Link to="/registro" className="not_account">No tengo una cuenta</Link>
                    </h5>
                </div>
            </form>
        </Fragment>
    )
}

export default Login