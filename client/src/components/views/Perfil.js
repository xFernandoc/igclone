import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
const Profile = ()=>{
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    useEffect(()=>{
        fetch('/mypost',{
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${localStorage.getItem("jwt")}`
            },
            method :"GET"
        })
        .then(res=>res.json())
        .then(results=>{
            console.log(results)
            setData(results.mypost)
        })
    },[])
    useEffect(()=>{
        if(image){
            const data = new FormData()
            data.append("file",image)
            data.append("upload_preset","red-insta")
            data.append("cloud_name","dnayrcm6i")
            fetch("https://api.cloudinary.com/v1_1/dnayrcm6i/image/upload",{
                method : "POST",
                body : data
            })
            .then(res => res.json())
            .then( data => {
                fetch('/actualizarpic',{
                    method : "PUT",
                    headers : {
                        "Content-Type" : "application/json",
                        "Authorization" : `Bearer ${localStorage.getItem("jwt")}`
                    },
                    body : JSON.stringify({
                        pic : data.url
                    })
                }).then(res => res.json())
                .then(result =>{ 
                    localStorage.setItem("user",JSON.stringify({... state, pic : result.pic}))
                    dispatch({type : "UPDATEPIC", payload : result.pic})
                })
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },[image])
    const subirFoto = (image) =>{
        setImage(image)
    }
    return(
        <>
        {
            data
            ?
                
                <div className="prueba row" style={{backgroundColor : "rgba(0, 0, 0, 0.08)", marginBottom : "0px"}}>
                    <div className="col s12 offset-m2 m8 offset-l3 l6">
                        <div className="card grey lighten-5 z-depth-2">
                            <div className="row" style={{padding : "1rem"}}>
                                <div className="col s4" style={{
                                    display : "flex",
                                    justifyContent : "center",
                                    alignItems : "center"
                                }}>
                                    <div style={{height : "75%", width : "75%"}}>
                                        <img 
                                            className="circle responsive-img"
                                            src={state ? state.pic : ""}
                                            alt="perfil"
                                        />
                                    </div>
                                </div>
                                <div className="col s8">
                                    <div className="clsname">{state ? state.name : "loading"}</div>
                                    <div className="clsemail">{state ? state.email : "loading"}</div>
                                    <div className="clsperfil_i">
                                        <h6>{data.length} post</h6>
                                        <h6>{state ? state.followers.length : "loading"} seguidores</h6>
                                        <h6>{state ? state.following.length : "loading"} seguidos</h6>
                                    </div>
                                </div>
                                <div className="col s12">
                                    <div className="subirimg">
                                        <div className="file-field input-field">
                                            <div className="btn  waves-light blue">
                                                <span>Subir perfil</span>
                                                <input
                                                accept="image/x-png,image/gif,image/jpeg"
                                                type="file"
                                                onChange={(e)=>subirFoto(e.target.files[0])}
                                                />
                                            </div> 
                                            <div className="file-path-wrapper">
                                                <input 
                                                placeholder="Opcional"
                                                className="file-path validate"
                                                type="text"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col s12 offset-l2 l8" style={{padding : "1rem"}}>
                        <div className="galeria">
                            {
                                data.map((e)=>{
                                    return(
                                        <figure key={e._id} className="z-depth-2">
                                            <img src={e.photo} alt ="post"/>
                                        </figure>                                        
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            :
            <div style={{
                height : "90vh",
                width : "100vw",
                display : "flex",
                justifyContent : "center",
                alignItems : "center"
            }}>
                <div className="brand-logo left anim_loader">Instagram</div>
            </div> 
        }
        </>
    )
}

export default Profile