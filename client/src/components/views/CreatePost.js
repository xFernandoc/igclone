import React,{useState,Fragment,useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'
import {socket} from '../../App'
const CreatePost = ()=>{
    const history = useHistory()
    const [title , setTitle] = useState("")
    const [body , setBody] = useState("")
    const [image , setImage] = useState("")
    const [pic , setUrl] = useState("")
    const [loader, setLoader] = useState(false)
    useEffect(()=>{
        if(pic){
            fetch("/createpost",{
                method : "post",
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${localStorage.getItem("jwt")}`
                },
                body : JSON.stringify({
                    title,
                    body,
                    pic
                })
            })
            .then(res => res.json())
            .then(data=>{
                if(data.error){
                    M.toast({html : data.error,classes : "#d32f2f red darken-2"})
                    setLoader(false)
                }else{
                    M.toast({html : "Hecho !",classes : "#388e3c green darken-2"})
                    history.push('/')
                    socket.emit('post:refresh',true)
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },[pic])
    const postDetails = ()=>{
        if(image && body && title){
            setLoader(true)
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
            })
            .catch(err=>{
                console.log(err)
            })
        }else{
            M.toast({html : "Campos incompletos",classes : "#388e3c red darken-2"})
        }
    }

    return (
        <Fragment>
            <div className="card input-field" style={{maxWidth : "500px",margin:"10px auto",padding : "20px",textAlign : "center"}}>
                <input
                    type="text"
                    placeholder="Titulo"
                    value = {title}
                    onChange={(e)=>setTitle(e.target.value)}
                />
                <input 
                    type="text"
                    placeholder="Escriba una descripción"
                    value = {body}
                    onChange={(e)=>setBody(e.target.value)}
                />
                <div className="file-field input-field">
                    <div className="btn  waves-light blue">
                        <span>Imagen</span>
                        <input
                        accept="image/x-png,image/gif,image/jpeg"
                        type="file"
                        onChange={(e)=>{
                            let filename = e.target.files[0]
                            if((/\.(gif|jpe?g|tiff|png|webp|bmp)$/i).test(filename.name)){
                                setImage(e.target.files[0])
                            }else{
                                M.toast(
                                    {html : "Solo imagenes porfavor",classes : "#388e3c red darken-2"} 
                                )
                                setImage('')
                                e.target.value = ""
                            }
                        }}
                        />
                    </div> 
                    <div className="file-path-wrapper">
                        <input 
                        className="file-path validate"
                        type="text"/>
                    </div>
                </div>
                {
                    loader ? 
                    <button onClick={(e)=>postDetails()} className="btn waves-light blue disabled" style={{display : "inline-block"}}>
                        <div className="loader_p"><span>Publicando </span> <span className="lds-dual-ring"></span></div>
                    </button>
                    :
                    <button onClick={(e)=>postDetails()} className="btn waves-light blue">Publicar</button>
                }
                
            </div>
        </Fragment>
    )
}

export default CreatePost