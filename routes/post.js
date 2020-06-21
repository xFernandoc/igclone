const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requiredLogin = require('../middlewares/requireLogin')
const Post = mongoose.model("Post")

//view posts
router.get('/allpost',requiredLogin,(req,res)=>{
    //populate encuentra la data de la ref.
    Post.find()
    .populate("posttedBy","_id name")
    .populate("comments.posttedBy","_id name")
    .sort('-createdAt')
    .then((posts)=>{
        res.status(200).json({posts})
    })
    .catch((err)=>{
        res.status(422).json({message : "Error"})
        console.log(err)
    })
})

router.get('/getsubpost',requiredLogin,(req,res)=>{
    
    Post.find({posttedBy : {$in : req.user.following}})
    .populate("posttedBy","_id name")
    .populate("comments.posttedBy","_id name")
    .sort('-createdAt')
    .then((posts)=>{
        console.log(posts)
        res.status(200).json({posts})
    })
    .catch((err)=>{
        res.status(422).json({message : "Error"})
        console.log(err)
    })
})

//create posts

router.post('/createpost',requiredLogin,(req,res)=>{
    const { title,body,pic} = req.body
    console.log(req.body)
    if(!title || !body || !pic) return res.status(422).json({error : "Campos vacios"})
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo : pic,
        posttedBy:req.user
    })
    post.save()
    .then((result)=>{
        return res.status(200).json({message : result})
    })
    .catch((err)=>{
        console.log(err)
        return res.status(422).json({error : "ERROR"})
    })
})

router.get('/mypost',requiredLogin,(req,res)=>{
    Post.find({posttedBy : req.user.id})
    .populate("posttedBy")
    .then((mypost)=>{
        res.status(200).json({mypost})
    })
    .catch((err)=>{
        console.log(err)
        res.status(422).json({message : "Error"})
    })
})

router.put('/like',requiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push : {likes : req.user.id}
    },{
        new : true
    }).populate("posttedBy","_id name").populate("comments.posttedBy","_id name").exec((err,result)=>{
        console.log(result)
        if(err) return res.status(422).json({error : err})
        res.json(result)
    })
})

router.put('/unlike',requiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull : {likes : req.user._id}
    },{
        new : true
    }).populate("posttedBy","_id name").populate("comments.posttedBy","_id name").exec((err,result)=>{
        if(err) return res.status(422).json({error : err})
        res.json(result)
    })
})

router.put('/comment',requiredLogin,(req,res)=>{
    const comment ={
        text : req.body.text,
        posttedBy : req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push : {comments : comment}
    },{
        new : true
    }).populate("comments.posttedBy","_id name").exec((err,result)=>{
        if(err) return res.status(422).json({error : err})
        res.json(result)
    })
})

router.put('/likecomment',requiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push : {"comments.$[inner].likeBy" : req.user._id},
    },{
        new : true,
        arrayFilters:[{
            "inner._id" : req.body.commentId
        }]
    }).populate("comments.posttedBy","_id name").populate("posttedBy","_id name").exec((err,result)=>{
        if(err) return res.status(422).json({error : err})
        res.json(result)
    })
})
router.put('/unlikecomment',requiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull : {"comments.$[inner].likeBy" : req.user._id},
    },{
        new : true,
        arrayFilters:[{
            "inner._id" : req.body.commentId
        }]
    }).populate("comments.posttedBy","_id name")
    .populate("posttedBy","_id name").exec((err,result)=>{
        if(err) return res.status(422).json({error : err})
        res.json(result)
    })
})

router.delete('/borrarpost/:postId',requiredLogin,(req,res)=>{
    Post.findOne({_id : req.params.postId})
    .populate("posttedBy","_id")
    .exec((err,post)=>{
        if(err || !post) return res.status(422).json({error : err})
        if(post.posttedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    })
})
module.exports = router