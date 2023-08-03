const request = require('supertest')

const app = require('../src/app')
const User = require('../src/model/user')

const {userOneId, userOne, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Takshal',
        email: 'takshal.modi2002@gmail.com',
        password: 'MyPass777!'
    }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user:{
            name: "Takshal"
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('MyPass777!')
})

test('Should login a user', async () => {
    const response = await request(app).get('/user/login').send({
        email: userOne.email,
        password: '56what!!'
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login a user', async () => {
    await request(app).get('/user/login').send({
        email: 'admin1234@gmail.com',
        password: '56what!!'
    }).expect(400)
})

test('Should get user profile', async () => {
    await request(app)
    .get('/user/me')
    .set({
        'Authorization':`Bearer ${userOne.tokens[0].token}`
    })
    .send({})
    .expect(200)
})

test('Should not get user profile', async () => {
    await request(app)
    .get('/user/me')
    .send({})
    .expect(401)
})

test('Should delete user profile', async () => {
    const response = await request(app)
    .delete('/user/me')
    .set({
        'Authorization':`Bearer ${userOne.tokens[0].token}`
    })
    .send()
    .expect(200)

    const user = await User.findById(userOneId)

    expect(user).toBeNull()
})

test('Should not delete user profile', async () => {
    await request(app)
    .delete('/user/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async()=>{
    await request(app)
        .post('/user/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('profilePic', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

        const user = await User.findById(userOneId)

        expect(user.avatar).toEqual(expect.any(Buffer))
} )

test('Should update valid user fields', async()=>{
    await request(app)
        .patch('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "Lord"
        })
        .expect(200)
})

test('Should not update invalid user fields', async()=>{
    await request(app)
        .patch('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            Location: "Lord"
        })
        .expect(400)
})