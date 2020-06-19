import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import { Link } from 'react-router-dom'

const Home = ()=>{
    const [data,setData] = useState([])
    const {state , dispatch } = useContext(UserContext)
    useEffect(()=>{
        fetch('/allpost',{
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
    return(
        <div className="home">
            {
                data.map((item)=>{
                    return(
                        <div key={item._id} className="card home-card">
                            <h5 style={{padding : "1rem"}}>{<Link to={item.posttedBy._id!==state._id ? `/perfil/${item.posttedBy._id}` : "/perfil"} >{item.posttedBy.name}</Link>} {
                                item.posttedBy._id === state._id  && 
                                <i className="material-icons" style={{cursor : "pointer", float : "right"}} onClick={()=>borrarpost(item._id)}>delete</i>
                                }
                            </h5>
                            <div className="card-image">
                                <img src={item.photo} alt=""/>
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{color : "red"}}>favorite</i> 
                                {
                                    item.likes.includes(state._id) 
                                    ? 
                                    <i className="material-icons" onClick={()=>{unLikePost(item._id)}} style={{cursor : "pointer"}}>thumb_down</i>
                                    :
                                    <i className="material-icons" onClick={()=>{likePost(item._id)}} style={{cursor : "pointer"}}>thumb_up</i>
                                }
                                <h6>{item.likes.length} me gusta</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map((comment)=>{
                                        return (
                                            <h6 key={comment._id}><span style={{ fontWeight : "500"}} >{comment.posttedBy.name} </span>{comment.text}</h6>
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
                    )
                })
            }
            
        </div>
    )
}

export default Home