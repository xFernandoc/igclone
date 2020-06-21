import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import { Link } from 'react-router-dom'

const Home = ()=>{
    const [data,setData] = useState([])
    const {state , dispatch } = useContext(UserContext)
    useEffect(()=>{
        fetch('/getsubpost',{
            method : "GET",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${localStorage.getItem("jwt")}`
            },
        })
        .then(res => res.json())
        .then(results=>{
            setData(results.posts)
        })
    },[])

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
        })
        .catch(err=>{
            console.log(err)
        })
    }
    return(
        <>
            {
                data.length>0 
                ?
                    <div className="prueba row" style={{backgroundColor : "rgba(0, 0, 0, 0.08)", marginBottom : "0px"}}>
                        {
                            data.map((item)=>{
                                return(
                                    <div key={item._id} className="col s12 offset-m3 m6">
                                        <div className="card" style={{margin : "0.5rem 0.5rem"}}>
                                            <h5 style={{padding : "1rem"}}>{<Link to={item.posttedBy._id!==state._id ? `/perfil/${item.posttedBy._id}` : "/perfil"} >{item.posttedBy.name}</Link>} {
                                                item.posttedBy._id === state._id  && 
                                                <i className="material-icons" style={{cursor : "pointer", float : "right"}} onClick={()=>borrarpost(item._id)}>delete</i>
                                                }
                                            </h5>
                                            <div className="card-image">
                                                <img src={item.photo} alt=""/>
                                            </div>
                                            <div className="card-content">
                                                <h6 style={{display: "flex", alignItems : "center", marginTop : "0"}}>
                                                {
                                                    item.likes.includes(state._id) 
                                                    ? 
                                                    <i className="material-icons" onClick={()=>{unLikePost(item._id)}} style={{cursor : "pointer", color : "red"}}>favorite</i>
                                                    :
                                                    <i className="material-icons" onClick={()=>{likePost(item._id)}} style={{cursor : "pointer", color : "red"}}>favorite_border</i>
                                                }{item.likes.length} me gusta</h6>
                                                <h6>{item.title}</h6>
                                                <p>{item.body}</p>
                                                {
                                                    item.comments.map((comment)=>{
                                                        return (
                                                            <h6 key={comment._id}>
                                                                <span style={{ fontWeight : "bold", cursor : "pointer"}} className="blue-text text-darken-2" >{comment.posttedBy.name} </span>{comment.text}
                                                                {
                                                                    comment.likeBy.includes(state._id)
                                                                    ?
                                                                    <i className="right material-icons" style={{cursor : "pointer", color : "red"}} onClick={(e)=>unlikeComment(item._id,comment._id)}>favorite</i>
                                                                    :
                                                                    <i className="right material-icons" style={{cursor : "pointer", color : "red"}} onClick={(e)=>likeComment(item._id,comment._id)}>favorite_border</i>
                                                                }
                                                            </h6>
                                                        )
                                                    })
                                                }
                                                <form onSubmit={(e)=>{
                                                    e.preventDefault()
                                                    comentar(e.target[0].value,item._id)
                                                    e.target[0].value=''
                                                }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Escribe un comentario"
                                                    />
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
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