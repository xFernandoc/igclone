import React , {useState, Fragment, useEffect} from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

const Registro = ()=>{
    const history = useHistory()
    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [image , setImage ] = useState("")
    const [url , setUrl ] = useState(undefined)

    useEffect(()=>{
        if(url){
            subirData()
        }
    },[url])

    const subirPerfil = () =>{
        const data = new FormData()
        const loader = document.getElementById('loader')
        loader.style.display="flex";
        data.append("file",image)
        data.append("upload_preset","red-insta")
        data.append("cloud_name","dnayrcm6i")
        fetch("https://api.cloudinary.com/v1_1/dnayrcm6i/image/upload",{
            method : "POST",
            body : data
        })
        .then(res => res.json())
        .then( data => {
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const subirData = ()=>{
        const loader = document.getElementById('loader')
        loader.style.display="flex";
        const data = JSON.stringify({
            name,
            email,
            password,
            pic : url
        })
        fetch('/registro',{
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
                M.toast({html : data.message,classes : "#388e3c green darken-2"})
                history.push('/login')
            }
        })
    }

    const envio = (e) =>{
        e.preventDefault()
        if(image){
            subirPerfil()
        }else{
            subirData()
        }
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
                                <i className="material-icons prefix l_icon">account_circle</i>
                                <input value={name} onChange={(e)=>setName(e.target.value)} id="i_name" type="text" className="validate"/>
                                <label htmlFor="i_name">Nombre</label>
                            </div>
                        </div>
                    </div>
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
                                <input autoComplete="off" value={password} onChange={(e)=>setPassword(e.target.value)} id="i_clave" type="password" className="validate"/>
                                <label htmlFor="i_clave">Clave</label>
                            </div>
                        </div>
                    </div>
                    <div className="file-field input-field">
                        <div className="btn  waves-light blue">
                            <span>Perfil</span>
                            <input
                            accept="image/x-png,image/gif,image/jpeg"
                            type="file"
                            onChange={(e)=>setImage(e.target.files[0])}
                            />
                        </div> 
                        <div className="file-path-wrapper">
                            <input 
                            placeholder="Opcional"
                            className="file-path validate"
                            type="text"/>
                        </div>
                    </div>
                    <button id="btn_r" type="submit" className="btn waves-effect #1e88e5 blue darken-1">
                        Registro
                    </button>
                    <h5 >
                        <Link to="/Login" className="not_account">Tengo una cuenta</Link>
                    </h5>
                </div>
            </form>
        </Fragment>
    )
}

export default Registro