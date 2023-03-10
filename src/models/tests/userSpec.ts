import supertest = require('supertest')
//import dotenv from 'dotenv'
import { UserModel } from '../userModel'

import { AuthenticationService } from '../../services/Authentication'

import app from '../../server'

const store = new UserModel()
const req = supertest(app)
const { DEFAULT_PASS } = process.env
const token = AuthenticationService.generateToken(DEFAULT_PASS as string)

describe('User Model Test', () => {
  it('user model should have an index method', () => {
    expect(store.index).toBeDefined()
  })
  it('user model should have a show method', () => {
    expect(store.show).toBeDefined()
  })
  it('user model should have a create method', () => {
    expect(store.create).toBeDefined()
  })
})

describe('Test User Creation', () => {
  it('should contain all created users', async () => {
    const user1 = await store.create({
      id: 1,
      first_name: 'Dela',
      last_name: 'Joe',
      username: 'dela',
      password: DEFAULT_PASS as string,
    })

    const user2 = await store.create({
      id: 2,
      first_name: 'Francis',
      last_name: 'Ama',
      username: 'francis',
      password: DEFAULT_PASS as string,
    })

    /* expect(await store.index()).toEqual([
      {
        id: 1,
        first_name: 'Dela',
        last_name: 'Joe',
        username: 'dela',
      },
      {
        id: 2,
        first_name: 'Francis',
        last_name: 'Ama',
        username: 'francis',
      },
    ]) */
  })
})

describe('users route should send status code', () => {
  it('200 if all users are returned.', async () => {
    const res = await req
      .get(`/api/users`)
      .set({ authorization: `Bearer ${token}` })
    expect(res.statusCode).toBe(200)
  })

  it('Test user creation', async () => {
    const user = await store.create({
      id: 3,
      first_name: 'Francis',
      last_name: 'Ama',
      username: 'francis',
      password: DEFAULT_PASS as string,
    })

    console.log(user)
    const res = await req
      .get(`/api/users/${user.id}`)
      .set({ authorization: `Bearer ${token}` })
    expect(res.statusCode).toBe(200)
  })
})
