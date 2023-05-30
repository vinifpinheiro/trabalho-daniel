import { FastifyInstance } from 'fastify'
import {z} from 'zod'
import {prisma} from './lib/prisma'
import dayjs from 'dayjs'

export async function AppRoutes(app: FastifyInstance) {
    // rota para criar um user
    app.post('/user', async (request) => {
        const postBody  = z.object({
                username: z.string(),
                password: z.string(), 
                email: z.string()       
            })
        const {username, password, email} = postBody.parse(request.body)
        const created_at = dayjs().startOf('day').toDate() // sem hora, minuto e segundo
        const newUser = await prisma.user.create({
            data: {
                username,
                password, 
                email,
                created_at
        }
        })
        return newUser
    })

     // rota para recuperar um user
     app.get('/user/:username/:password', async (request) => {
        const getBody  = z.object({
                username: z.string(),
                password: z.string(), 
            })
        const {username, password } = getBody.parse(request.params)
        const user = await prisma.user.findMany({
            where: {
                username: username,
                password: password
            }
        })
        return user
    })
}