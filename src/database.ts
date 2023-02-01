import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_TEST_DB,
  ENV,
} = process.env

let client: Pool | any
console.log(ENV)

if (ENV === 'test') {
  client = new Pool({
    host: DATABASE_HOST,
    database: DATABASE_TEST_DB,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
  })
}

if (ENV === 'dev') {
  client = new Pool({
    host: DATABASE_HOST,
    database: DATABASE_NAME,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
  })
}

export default client
