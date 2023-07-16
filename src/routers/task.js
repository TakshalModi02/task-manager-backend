const express = require('express')
const router = new express.Router();
const auth = require("../middleware/auth");

const Task = require('../model/task')


router.post('/tasks',auth, async (req, res)=>{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        const newTask = await task.save()
        res.status(200).send(newTask)
    }catch(err){
        res.status(400).send(err)
    }
})

//GET /tasks?completed=true
//GET /tasks?limit=2&skip=createdAt_dedc
//GET /tasks?sortBy=1/-1

router.get('/tasks',auth,async (req, res)=>{
    const match = {}
    const sort = {}
    if(req.query.isCompleted){
        match.isCompleted = req.query.isCompleted === "true"? true:false
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1]==="desc"?-1:1
    }
    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        return res.status(200).send(req.user.tasks)
    }catch(err){
        console.log(err)
        res.status(500).send(err);
    }
})
  

router.get('/tasks/:id',auth,async (req, res)=>{
    const _id = req.params.id

    try{
        // const reqTask = await Task.findById(_id)
        const reqTask = await Task.findOne({
            _id, 
            owner: req.user._id
        })
        if(reqTask){
            return res.status(200).send(reqTask)
        }
        res.status(404).send(null)
    }catch(err){
        res.status(500).send(err);
    }
})

router.patch('/tasks/:id', auth, async (req, res)=>{
    const _id = req.params.id;
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description', 'isCompleted']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })


    if(!isValidOperation){
        return res.status(400).send({error:'Invalid Update'})
    }

    try{    
        const task = await Task.findOne({
            _id, 
            owner: req.user._id   
        });

        if(!task){
            return res.status(404).send(task);
        }
        updates.forEach((key)=>{
            task[key] = req.body[key]
        })
        task.save();
        res.status(200).send(task)
        
    }catch(err){
        res.status(500).send(err);
    }
})

router.delete("/tasks/:id",auth,async (req, res)=>{
    const _id = req.params.id;

    try{
        const task = await Task.findOneAndDelete({
            _id, 
            owner:req.user._id
        })
        if(task){
            return res.status(200).send(task)
        }
        res.status(404).send(null)    
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router