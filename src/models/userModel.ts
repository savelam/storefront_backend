import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import client from '../database'

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env

export type User = {
  id: number
  first_name: string
  last_name: string
  username: string
  password: string
}

export class UserModel {
  // all users
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM users'
      const result = await conn.query(sql)
      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Unable to read users: ${err}`)
    }
  }

  // show user based on user id
  async show(id: string): Promise<User> {
    const conn = await client.connect()
    const sql = 'SELECT id, first_name , last_name FROM users WHERE id=($1)'
    const result = await conn.query(sql, [id])
    conn.release()
    return result.rows[0]
  }
  async create(u: User): Promise<User> {
    try {
      const conn = await client.connect()
      const sql =
        'INSERT INTO users(first_name,last_name,username,password)  VALUES($1, $2,$3,$4) RETURNING id, first_name,last_name,username'

      const hash = bcrypt.hashSync(
        u.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS as string)
      )
      const result = await conn.query(sql, [
        u.first_name,
        u.last_name,
        u.username,
        hash,
      ])
      const user = result.rows[0]
      conn.release()

      return user
    } catch (err) {
      throw new Error(`Unable to create user (${u.username}): ${err}`)
    }
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    // @ts-ignore
    const conn = await client.connect()
    const sql = 'SELECT password_digest FROM users WHERE username=($1)'

    const result = await conn.query(sql, [username])

    console.log(password + BCRYPT_PASSWORD)

    if (result.rows.length) {
      const user = result.rows[0]

      console.log(user)

      if (
        bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password_digest)
      ) {
        return user
      }
    }

    return null
  }
}
