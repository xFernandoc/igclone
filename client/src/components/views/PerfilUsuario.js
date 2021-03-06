import React,{useState,useEffect,useContext} from 'react'
import {useParams,useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'
const Profile = ()=>{
    const [perfilUsuario , setPerfil] = useState(null)
    const {userid} = useParams()
    const history = useHistory()
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
                M.toast({html : results.message,classes : "#388e3c red darken-2"})
                history.push('/')
            }else{
                setPerfil(results)
            }
        })
    },[])

    const followUser = () =>{
        let elem = document.getElementById('btns')
        elem.disabled = true
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
            elem.disabled = false
        }).catch(err=>{
            console.log(err)
        })
    }
    const unfollowUser = () =>{
        let elem = document.getElementById('btnds')
        elem.disabled = true
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
            elem.disabled = false
            
        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <>{
            perfilUsuario 
            ? 
            <div className="prueba row" style={{backgroundColor : "rgba(0, 0, 0, 0.08)", marginBottom : "0px"}}>
                <div className="col s12 offset-m2 m8 offset-l3 l6">
                    <div className=" grey lighten-5" style={{margin : "1rem 0", padding : "4% 2%"}}>
                        <div className="row">
                            <div className="col s4 img_p" style={{position : "relative"}}>
                                <img 
                                    className="circle"
                                    style= {{width : "100%", height : "160px"}}
                                    src={perfilUsuario.user.pic}
                                    alt="perfil"
                                />
                            </div>
                            <div className="col s8">
                                <div className="clsname">{perfilUsuario.user.name}</div>
                                <div className="clsemail">{perfilUsuario.user.email}</div>
                                <div className="clsperfil_i">
                                    <h6>{perfilUsuario.posts.length} post</h6>
                                    <h6>{perfilUsuario.user.followers.length} seguidores</h6>
                                    <h6>{perfilUsuario.user.following.length} seguidos</h6>
                                </div>
                            </div>
                            <div className="col s12 center">
                                {
                                    showfollow ? 
                                    <button id="btns" className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={(e)=>followUser()}>
                                        Seguir
                                    </button>
                                    :
                                    <button id="btnds" className="btn waves-effect waves-light #64b5f6 red darken-1" onClick={(e)=>unfollowUser()}>
                                        Deja de seguir
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col s12 offset-l2 l8" style={{padding : "1rem"}}>
                        <div className="galeria">
                            {
                                perfilUsuario.posts.map((e)=>{
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