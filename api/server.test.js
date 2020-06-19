const request = require('supertest')
const server = require('./server.js')
const db = require('../database/dbConfig.js')


describe('server.js', ()=>{

  beforeEach(async () => {
    await db("users").truncate();
  });

  describe('auth-router routes', ()=>{

    describe('POST /api/auth/register', ()=>{

      it ('Should return Status 200 OK', ()=>{
        return request(server)
          .post('/api/auth/register')
          .send({username: "user", password: "password"})
          .then(res => {
            expect(res.status).toBe(200)
          })
      })

      it ('Should return Success Message', ()=>{
        return request(server)
          .post('/api/auth/register')
          .send({username: "user", password: "password"})
          .then(res => {
            expect(res.body.message).toBe("Thank you for Registering! Your ID number is 1")
          })
      })
    })


    describe('POST /api/auth/login', ()=>{
      
      it ('Should return Status 200 OK', async ()=>{
        await request(server)
          .post('/api/auth/register')
          .send({username: "user", password: "password"})
          .then(() => {
            return request(server)
              .post('/api/auth/login')
              .send({username: "user", password: "password"})
              .then(res => {
                expect(res.status).toBe(200)
              })
          })  
      })

      it ('Should return an object with Message AND Token', async ()=>{
        await request(server)
          .post('/api/auth/register')
          .send({username: "user", password: "password"})
          .then(()=>{
            return request(server)
              .post('/api/auth/login')
              .send({username: "user", password: "password"})
              .then(res => {
                expect(res.body).toEqual(expect.objectContaining({message: expect.any(String), token: expect.any(String)}))
              })
          })
      })
    })

  })

  describe('jokes route', ()=>{

    describe('GET /api/jokes', ()=>{

      it('Should send back an Error if no Auth Token is found', async ()=>{
        await request(server)
          .post('/api/auth/register')
          .send({username: "user", password: "password"})
          .then(async ()=>{
           await request(server)
              .post('/api/auth/login')
              .send({username: "user", password: "password"})
              .then(() => {
                return request(server)
                  .get('/api/jokes')
                  .then(res =>{
                    expect(res.status).toBe(401)
                  })  
              })
          })
      })

      it('Should return a list of jokes', async ()=>{
        await request(server)
          .post('/api/auth/register')
          .send({username: "user", password: "password"})
          .then(async ()=>{
           await request(server)
              .post('/api/auth/login')
              .send({username: "user", password: "password"})
              .then(result => {
                const token = result.body.token
                return request(server)
                  .get('/api/jokes')
                  .set({authorization: token})
                  .then(res =>{
                    expect(res.body).toHaveLength(20)
                  })  
              })
          })
      })
    })
  })

})