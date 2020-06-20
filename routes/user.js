const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requiredLogin = require('../middlewares/requireLogin')
const Post = mongoose.model("Post")
const User = mongoose.model("User")

router.get('/user/:id',requiredLogin,(req,res)=>{
    User.findOne({_id : req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({posttedBy : req.params.id})
        .populate("posttedBy","_id name")
        .exec((err,posts)=>{
            if(err) return res.status(422).json({error : err})
            res.json({user,posts})
        })
    })
    .catch(err=>{
        return res.status(404).json({message : "No encontrado"})
    })
})

router.put('/follow',requiredLogin,(req,res)=>{
    // aumenta
    User.findByIdAndUpdate(req.body.followId,{
        $push : {followers : req.user._id}
    },{
        new : true
    },(err,y)=>{
        if(err) return res.status(422).json({error : err})
        User.findByIdAndUpdate(req.user._id,{
            $push :{following : req.body.followId }
        },{new : true}).select("-password").then(m =>{
            res.json({
                y : y,
                m : m
            })
        }).catch(err=>{
            return res.status(422).json({error : err})
        })
    })
})

router.put('/unfollow',requiredLogin,(req,res)=>{
    // pull borra el quie ya esta
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull : {followers : req.user._id}
    },{
        new : true
    },(err,y)=>{
        if(err) return res.status(422).json({error : err})
        User.findByIdAndUpdate(req.user._id,{
            $pull :{following : req.body.unfollowId }
        },{new : true}).select("-password").then(m =>{
            res.json({
                y : y,
                m : m
            })
        }).catch(err=>{
            return res.status(422).json({error : err})
        })
    })
})

router.put('/actualizarpic', requiredLogin, (req,res)=>{
    //set -> establece
    User.findByIdAndUpdate(req.user._id,{
        $set : {
            pic : req.body.pic
        }
    },{new : true},(err,resultado)=>{
        if(err) return res.status(422).json({error : "Error"})
        res.json(resultado)
    }).select("-password")
})

router.post('/buscar-users',requiredLogin,(req,res)=>{
    let userQ = new RegExp(".*"+req.body.query+".*")
    User.find({name : {$regex : userQ}})
    .select("_id name pic email").limit(5)
    .then(user=>{
        res.json(user)
    }).catch(err=>{
        res.status(422).json({error : err})
    })
})

module.exports = router