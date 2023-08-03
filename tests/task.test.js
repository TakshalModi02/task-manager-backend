const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/model/task')
const { userOneId, userOne, userTwoId, userTwo, taskOne, taskTwo, taskThree, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async ()=>{
    const response = await request(app)
        .post('/tasks')
        .set({
            'Authorization':`Bearer ${userOne.tokens[0].token}`
        })
        .send({
            title: "fourth task",
            description: "Please node bhai kam karja",
            isCompleted: false
        })
        .expect(200)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.isCompleted).toEqual(false)
})

test('Should get user 1 tasks', async()=>{
    const response = await request(app)
        .get('/tasks')
        .set({
            "Authorization": `Bearer ${userOne.tokens[0].token}`
        })
        .send()
        .expect(200)

        expect(response.body.length).toEqual(1)
})
