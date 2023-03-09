import express, { Request, Response } from 'express'
import dotevn from 'dotenv'

//import product_routes from '../src/handlers/Product'
//import user_routes from '../src/handlers/User'
import product_routes from './handlers/Product'
import user_routes from './handlers/User'
import authenticatitonRoutes from './handlers/AuthenticationRoute'

// load the env
dotevn.config()

const app: express.Application = express()

// define the port
const PORT = process.env.PORT || 3000

//const corsOptions = {
//  origin: 'http://example.com',
//  optionsSuccessStatus: 200,
//}

//console.log(process.env.ENV)
//app.use(cors(corsOptions))
app.use(express.json())

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!')
})

// load the product route here
user_routes(app)
authenticatitonRoutes(app)
product_routes(app)

app.listen(PORT, function () {
  console.log(`starting app on: ${PORT}`)
})

export default app
