const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    // authorization  === Bearer ...
    if(!authorization) return res.status(401).send({"m":"Debes logearte"})
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        // verifico el token
        if(err) return res.status(401).send({"m": "Debes logerarte","e" : err})
        const { id } = payload
        User.findById(id)
        .then((data)=>{
            req.user = data
            next()
        }).catch((err)=>{
            res.status(401).send({"m":err})
            next()
        })
    })
}