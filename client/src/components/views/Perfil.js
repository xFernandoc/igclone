import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
const Profile = ()=>{
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [url, setUrl] = useState("")
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
                setUrl(data.url)
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
            data.length>=0 
            ?
                <div style={{maxWidth : "80%", margin : "0px auto"}} className="prueba">
                    <div style={{
                        margin : "18px 0px",
                        borderBottom : "1px solid grey"
                    }}>
                        <div 
                        style={{
                            display : "flex",
                            justifyContent : "space-around",
                        }}
                        >
                            <div >
                                <img 
                                    style={{width : "160px", height : "160px", borderRadius : "80px"}}
                                    src={state ? state.pic : "loading"}
                                    className="perfil"
                                    alt="perfil"
                                />
                            </div>
                            <div>
                                <h4>{state ? state.name : "loading"}</h4>
                                <h6>{state ? state.email : "loading"}</h6>
                                <div style={{display : "flex", justifyContent : "space-between", width:"108%"}}>
                                    <h6>{data.length} post</h6>
                                    <h6>{state ? state.followers.length : "loading"} seguidores</h6>
                                    <h6>{state ? state.following.length : "loading"} seguidos</h6>
                                </div>
                            </div>
                        </div>
                        
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
                    <div className="galeria">
                        {
                            data.map((e)=>{
                                return(
                                    <img key={e._id} className="item" src={e.photo} alt ="post"/>
                                )
                            })
                        }
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