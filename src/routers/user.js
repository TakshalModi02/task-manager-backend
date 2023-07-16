const express = require('express')
const multer = require("multer")
const sharp = require("sharp")
const User = require('../model/user')
const auth = require('../middleware/auth')
const sendEmail = require('../email/email_config')
const router = new express.Router()

const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)/)){
            return cb(new Error("Please upload image file only"))
        }
        cb(undefined, true)
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    
    try {
        await user.save()

        sendEmail(user.email, 'Welcome to task manager!!',`Hello ${user.name}, Welcome to task manager app!!`)

        const token = await user.generateAuthToken();
        res.status(200).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/user/login', async (req, res) => {
    if (!req.body.email) {
        return res.status(400).send("Please enter email!!")
    }
    else if (!req.body.password) {
        return res.status(400).send("Please enter password!!")
    }
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        
        if (user) {
            return res.status(200).send({user, token});
        }

        res.status(404).send(user);
    } catch (e) {
        console.log(e)
        res.status(400).send(e);
    }
})

router.post('/user/logout', auth, async(req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token
        })
        await req.user.save()
        res.send("Success")
    }catch(e){
        res.status(500).send({
            'error':'Server Error!!'
        })
    }
})

router.post('/user/logoutAll', auth, async(req, res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        console.log(req.user);
        res.send("Success!!")
    }catch(e){
        res.status(500).send({
            'error':'Server Error!!'
        })
    }
})

router.get('/user/me', auth, async (req, res) => {
    return res.status(200).send(req.user)
})

router.patch('/user/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Update' })
    }

    try {
        
        updates.forEach((key) => {
            req.user[key] = req.body[key]
        })

        await req.user.save()

        res.send(req.user)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.delete("/user/me", auth, async (req, res) => {
    const user = req.user

    try {
        await user.deleteOne()
    
        sendEmail(user.email, "Goodbye!!", "Please comback soon!! Hope you had great experince with us!!")

        if (user) {
            return res.status(200).send(user)
        }
        res.status(404).send(user)
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

router.post("/user/me/avatar", auth, upload.single("profilePic"), async (req, res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:256, height:256}).png().toBuffer()    
    req.user.avatar = buffer
    await req.user.save()
    res.send("Sucess!!")
}, (error, req, res, next)=>{
    res.status(400).send({error:error.message})
})

router.delete("/user/me/avatar", auth, async(req, res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send("Profile Pic deleted!")
})

router.get("/user/:id/avatar", async(req, res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error("Pata nai kya karu?")
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar) 

    }catch{
        res.status(404).send()
    }
})

module.exports = router
