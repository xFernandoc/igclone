const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')

router.post('/registro',(req,res)=>{
    console.log(req.body)
    const { name, email, password, pic } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({error : "Campos vacios"})
    }
    User.findOne({email : email}).then((svUser)=>{
        if(svUser) return res.status(422).json({error : "Correo existe"})
        //encriptado
        bcrypt.hash(password,12)
        .then(hased=>{
            const user = new User({
                name,
                email,
                password:hased,
                pic
            })
            user.save().then((user)=>{
                res.json({message:"Usuario creado"})
            }).catch((e)=>{
                console.log(e)
            })
        })
    }).catch((e)=>{
        res.send({"m" : "Error"})
        console.log(e)
    })
})


router.post('/login',(req,res)=>{
    const { email,password } = req.body
    if(!email || !password) return res.status(422).json({error : "Campos vacios"})
    User.findOne({email : email})
    .then((saveUser)=>{
        if(!saveUser) return res.status(440).json({error : "No encontrado"})
        bcrypt.compare(password,saveUser.password)
        .then((doMatch)=>{
            if(doMatch){
                // crear token
                const token  = jwt.sign({id : saveUser._id,},JWT_SECRET)
                const {_id, name, email,followers,following,pic} = saveUser
                return res.status(200).json({token : token,user : {_id,name,email,followers,following,pic}})
            }else{
                return res.status(440).json({error : "Clave incorrecta"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

module.exports = router