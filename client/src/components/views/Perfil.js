import React,{useState,useEffect,useContext,useRef} from 'react'
import {UserContext} from '../../App'
import M from 'materialize-css'
const Profile = ()=>{
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    const toolx = useRef(null)
    useEffect(()=>{
        M.Tooltip.init(toolx.current)
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
            let elemt = document.getElementById('perfil_i')
            let elemt2 = document.getElementById('carga_i')
            elemt.classList.add("filtro")
            elemt2.style.display = "flex"
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
                    elemt.classList.remove("filtro")
                    elemt2.style.display = "none"
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
                        <div className=" grey lighten-5" style={{margin : "1rem 0", padding : "4% 2%"}}>
                            <div className="row" >
                                <div className="col s4 img_p" style={{position : "relative"}}>
                                    <div className="carga_img" style={{display : "none"}} id="carga_i">
                                        <div className="progress">
                                            <div className="indeterminate"></div>
                                        </div>
                                    </div>
                                    <div className="updatefoto">
                                        <label className="custom-file-upload tooltipped" data-position="top" data-tooltip="Actualizar perfil" ref={toolx}>
                                            <input 
                                            accept="image/x-png,image/gif,image/jpeg"
                                            type="file"
                                            onChange={(e)=>subirFoto(e.target.files[0])}
                                            style={{display : "none"}}/>
                                            <i className="material-icons thin" style={{fontSize : "1.7rem"}}>camera_alt</i>
                                        </label>
                                    </div>
                                    <img 
                                        className="circle pupd"
                                        id="perfil_i"
                                        style= {{width : "100%", height : "160px"}}
                                        src={state ? state.pic : ""}
                                        alt="perfil"
                                    />
                                </div>
                                <div className="col s8">
                                    <div className="clsname">{state ? state.name : "loading"}</div>
                                    <div className="clsemail">{state ? state.email : "loading"}</div>
                                </div>
                                <div className="col s12 m8 offset-m4" style={{margin : "0.5rem 0"}}>
                                    <div className="clsperfil_i">
                                        <h6>{data.length} post</h6>
                                        <h6>{state ? state.followers.length : "loading"} seguidores</h6>
                                        <h6>{state ? state.following.length : "loading"} seguidos</h6>
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