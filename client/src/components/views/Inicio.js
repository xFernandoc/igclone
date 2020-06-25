import React,{useState,useEffect,useContext} from 'react'
import {UserContext,socket} from '../../App'
import { Link } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'

const Home = ()=>{
    const [data,setData] = useState([])
    const {state} = useContext(UserContext)
    const [alerta,setAlerta] = useState(false)
    const [loader,setLoader] = useState(true)
    socket.on('post:newPost',(data)=>{
        setAlerta(data)
    })
    socket.on('post:onlypost',(results)=>{
        const newData = data.map(item=>{
            if(item._id===results._id){
                return results
            }else{
                return item
            }
        })
        setData(newData)
    })
    socket.on('post:deletePost',(result)=>{
        const newData = data.filter(item=>{
            return item._id !== result._id
        })
        setData(newData)
    })
    useEffect(()=>{
        getData()
    },[])

    const getData = () =>{
        fetch('/allpost',{
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${localStorage.getItem("jwt")}`
            },
            body : JSON.stringify({size : 5/*, size_comment : 5*/})
        }).then((res)=>res.json())
        .then(results=>{
            setData(results.posts)
            setLoader(false)
        })
    }

    const cargar = () =>{
        let size = data.length +5
        fetch('/allpost',{
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${localStorage.getItem("jwt")}`
            },
            body : JSON.stringify({size : size/*, size_comment : 5*/})
        })
        .then(res => res.json())
        .then(results=>{
            setData(results.posts)
        })
    }

    const likePost = (id)=>{
        fetch('/like',{
            method : "PUT",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${localStorage.getItem("jwt")}`
            },
            body : JSON.stringify({postId : id})
        })
        .then(res => res.json())
        .then(results=>{    
            const newData = data.map(item=>{
                if(item._id===results._id){
                    return results
                }else{
                    return item
                }

            })
            setData(newData)
            socket.emit('post:onlypost',results)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const unLikePost = (id)=>{
        fetch('/unlike',{
            method : "PUT",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${localStorage.getItem("jwt")}`
            },
            body : JSON.stringify({postId : id})
        })
        .then(res => res.json())
        .then(results=>{
            const newData = data.map(item=>{
                if(item._id===results._id){
                    return results
                }else{
                    return item
                }

            })
            setData(newData)
            socket.emit('post:onlypost',results)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const comentar =  (text,postId)=>{
        fetch('/comment',{
            method : "PUT",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${localStorage.getItem("jwt")}`
            },
            body : JSON.stringify({postId,text})
        }).then(res=>res.json())
        .then(results=>{
            const newData = data.map(item=>{
                if(item._id===results._id){
                    return results
                }else{
                    return item
                }

            })
            setData(newData)
            socket.emit('post:onlypost',results)
        }).catch((err)=>{
            console.log(err)
        })
    }
    const borrarpost = (postId) =>{
        fetch(`/borrarpost/${postId}`,{
            method : "DELETE",
            headers : {
                Authorization : `Bearer ${localStorage.getItem("jwt")}`
            },
        }).then(res => res.json())
        .then(result =>{
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
            socket.emit('post:deletePost',result)
        }).catch(err=>{
            console.log(err)
        })
    }
    const likeComment = (postId,commentId) =>{
        fetch('/likecomment',{
            method : "PUT",
            headers : {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${localStorage.getItem("jwt")}`
            },
            body : JSON.stringify({postId,commentId})
        }).then(res=>res.json())
        .then(result => {
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }

            })
            setData(newData)
            socket.emit('post:onlypost',result)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const unlikeComment = (postId,commentId) =>{
        fetch('/unlikecomment',{
            method : "PUT",
            headers : {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${localStorage.getItem("jwt")}`
            },
            body : JSON.stringify({postId,commentId})
        }).then(res=>res.json())
        .then(result => {
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }

            })
            setData(newData)
            socket.emit('post:onlypost',result)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const llamarcoments = (id,cont,general) =>{
        fetch('/getmorecomments',{
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${localStorage.getItem("jwt")}`
            },
            body : JSON.stringify({postId : id,size : cont+5,conteog : general})
        }).then(res=>res.json())
        .then(result => {
            const results = result.posts[0]
            const newData = data.map(item=>{
                if(item._id===results._id){
                    return results
                }else{
                    return item
                }

            })
            setData(newData)
        })
        .catch(err=>console.log(err))
    }
    const goInicio = () =>{
        window.scroll(0, 0)
        setAlerta(false)
        setLoader(true)
        getData()
    }
    return(
        <>
            {
                !loader ?
                <div className="prueba row" style={{backgroundColor : "rgba(0, 0, 0, 0.08)", marginBottom : "0px", position : "relative"}}>
                    {
                       alerta &&  
                       <div className="alerta" onClick={()=>goInicio()}>
                           Nuevas actualizaciones ! 
                       </div>
                    }
                    <InfiniteScroll
                        dataLength={data.length}
                        hasMore= {true}
                        loader ={<h4>Cargando ...</h4>}
                        next = {cargar}
                    >
                        {
                        data.map((item)=>{
                            return(
                                <div key={item._id} className="col s12 offset-m2 m8 offset-l3 l6">
                                    <div className="card" style={{margin : "0.5rem 0.5rem"}}>
                                        <h5 style={{padding : "1rem"}}>{<Link to={item.posttedBy._id!==state._id ? `/perfil/${item.posttedBy._id}` : "/perfil"} >{item.posttedBy.name}</Link>} {
                                            item.posttedBy._id === state._id  && 
                                            <i className="material-icons" style={{cursor : "pointer", float : "right"}} onClick={()=>borrarpost(item._id)}>delete</i>
                                            }
                                        </h5>
                                        <div className="card-image">
                                            <img src={item.photo}/>
                                        </div>
                                        <div className="card-content">
                                            <h6 style={{display: "flex", alignItems : "center", marginTop : "0"}}>
                                            {
                                                item.likes.includes(state._id) 
                                                ? 
                                                <i className="material-icons" onClick={()=>{unLikePost(item._id)}} style={{cursor : "pointer", color : "red"}}>favorite </i> 
                                                :
                                                <i className="material-icons" onClick={()=>{likePost(item._id)}} style={{cursor : "pointer", color : "red"}}>favorite_border</i>
                                            }{item.likes.length} me gusta</h6>
                                            <h6>{item.title}</h6>
                                            <p>{item.body}</p>
                                            <hr></hr>
                                            {
                                                item.comments.map((comment)=>{
                                                    return (
                                                        <div key={comment._id}  className="comment">
                                                            <div className="comment-img">
                                                                <img
                                                                    src={comment.posttedBy.pic}
                                                                />
                                                            </div>
                                                            <div className="comment-box">
                                                                <div className="comment-header">
                                                                    <Link to={comment.posttedBy._id!==state._id ? `/perfil/${comment.posttedBy._id}` : "/perfil"} className="comment-autor">
                                                                        {comment.posttedBy.name}
                                                                    </Link>
                                                                </div>
                                                                <div className="comment-body">
                                                                    <div className="comment-text">
                                                                        {comment.text}
                                                                        <span className="right" style={{display : "flex"}}>
                                                                            {
                                                                                comment.likeBy.includes(state._id)
                                                                                ?
                                                                                <i className=" material-icons" style={{cursor : "pointer", color : "red"}} onClick={(e)=>unlikeComment(item._id,comment._id)}>favorite</i>
                                                                                :
                                                                                <i className="material-icons" style={{cursor : "pointer", color : "red"}} onClick={(e)=>likeComment(item._id,comment._id)}>favorite_border</i>
                                                                            }
                                                                            {
                                                                                comment.likeBy.length
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            <form style={{position : "relative"}} onSubmit={(e)=>{
                                                e.preventDefault()
                                                if(e.target[0].value!==''){
                                                    comentar(e.target[0].value,item._id)
                                                }
                                                e.target[0].value=''
                                            }}>
                                                <input
                                                    type="text"
                                                    placeholder="Escribe un comentario"
                                                />
                                                <button className="material-icons"
                                                    style={{
                                                        position : "absolute",
                                                        right: "0%",
                                                        top: "25%",
                                                        cursor : "pointer",
                                                        background : "transparent",
                                                        border : "0",
                                                        color: "#1357ad"}}>send</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        }
                    </InfiniteScroll>
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

export default Home