const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/model/user')
const Task = require('../../src/model/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'takshal.iiitv@gmail.com',
    password: '56what!!',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.jwt_secret)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Lokhand',
    email: 'ironore@gmail.com',
    password: '56what!!',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.jwt_secret)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Being ultimate Lord',
    description: 'I will make sure complete balance and peace after being lord',
    isCompleted: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    title: 'I want to bring ultimate peace on Universe',
    description: 'Peace with world order!!',
    isCompleted: true,
    owner: userTwo._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    title: 'World System',
    description: 'Develop and design a complete world system!',
    isCompleted: true,
    owner: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()

    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}