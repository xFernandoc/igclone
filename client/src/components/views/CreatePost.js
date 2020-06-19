import React,{useState,Fragment,useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'
const CreatePost = ()=>{
    const history = useHistory()
    const [title , setTitle] = useState("")
    const [body , setBody] = useState("")
    const [image , setImage] = useState("")
    const [pic , setUrl] = useState("")
    useEffect(()=>{
        if(pic){
            const loader = document.getElementById('loader')
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
                loader.style.display="none"
                if(data.error){
                    M.toast({html : data.error,classes : "#d32f2f red darken-2"})
                }else{
                    M.toast({html : "Hecho !",classes : "#388e3c green darken-2"})
                    history.push('/')
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },[pic])
    const postDetails = ()=>{
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

    return (
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
                        onChange={(e)=>setImage(e.target.files[0])}
                        />
                    </div> 
                    <div className="file-path-wrapper">
                        <input 
                        className="file-path validate"
                        type="text"/>
                    </div>
                </div>
                <button onClick={()=>postDetails()} className="btn waves-effect waves-light blue">Publicar</button>
            </div>
        </Fragment>
    )
}

export default CreatePost