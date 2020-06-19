import React,{useState,useEffect,useContext} from 'react'
import {useParams} from 'react-router-dom'
import {UserContext} from '../../App'
const Profile = ()=>{
    const [perfilUsuario , setPerfil] = useState(null)
    const {userid} = useParams()
    const {state,dispatch} = useContext(UserContext)
    const [showfollow , setshowfollow] = useState(state ? !state.following.includes(userid) : true)
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers : {
                "Authorization" : `Bearer ${localStorage.getItem("jwt")}`
            },
            method :"GET"
        })
        .then(res=>res.json())
        .then(results=>{
            if(results.message){
                console.log(results.message)
            }else{
                setPerfil(results)
            }
        })
        if(state){
            console.log(state)
        }
    },[])

    const followUser = () =>{
        fetch("/follow",{
            method : "PUT",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${localStorage.getItem("jwt")}`
            },
            body : JSON.stringify({
                followId : userid
            })
        }).then(res => res.json())
        .then(result =>{
            dispatch({
                type : "UPDATE",
                payload : {
                    following : result.m.following,
                    followers : result.m.followers
                }
            })
            localStorage.setItem("user",JSON.stringify(result.m))
            setPerfil((prevState)=>{
                return {
                    ...prevState,
                    user : result.y
                }
            })
            setshowfollow(false)
        }).catch(err=>{
            console.log(err)
        })
    }
    const unfollowUser = () =>{
        fetch("/unfollow",{
            method : "PUT",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${localStorage.getItem("jwt")}`
            },
            body : JSON.stringify({
                unfollowId : userid
            })
        }).then(res => res.json())
        .then(result =>{
            dispatch({
                type : "UPDATE",
                payload : {
                    following : result.m.following,
                    followers : result.m.followers
                }
            })
            localStorage.setItem("user",JSON.stringify(result.m))
            setPerfil((prevState)=>{
                return {
                    ...prevState,
                    user : result.y
                }
            })
            setshowfollow(true)
            
        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <>{
            perfilUsuario 
            ? 
            <div style={{maxWidth : "80%", margin : "0px auto"}} className="prueba">
                <div 
                    style={{
                        display : "flex",
                        justifyContent : "space-around",
                        margin : "18px 0px",
                        borderBottom : "1px solid grey"
                    }}
                    >
                        <div>
                            <img 
                                style={{width : "160px", height : "160px", borderRadius : "80px"}}
                                src={perfilUsuario.user.pic}
                                alt="perfil"
                            />
                        </div>
                        <div>
                            <h4>{perfilUsuario.user.name }</h4>
                            <h5>{perfilUsuario.user.email }</h5>
                            <div style={{display : "flex", justifyContent : "space-between", width:"108%"}}>
                                <h6>{perfilUsuario.posts.length} post</h6>
                                <h6>{perfilUsuario.user.followers.length} seguidores</h6>
                                <h6>{perfilUsuario.user.following.length} siguiendo</h6>
                            </div>
                            {
                                showfollow ? 
                                
                                <button style={{margin : "1rem 0rem"}} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={(e)=>followUser()}>
                                    Seguir
                                </button>
                                :
                                <button style={{margin : "1rem 0rem"}} className="btn waves-effect waves-light #64b5f6 red darken-1" onClick={(e)=>unfollowUser()}>
                                    Deja de seguir
                                </button>
                            }
                            
                        </div>
                    </div>
                    <div className="galeria">
                        {
                            perfilUsuario.posts.map((e)=>{
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