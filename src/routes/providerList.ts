import { Request, Response, Router } from "express"
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

const getProviders = async(req: Request, res: Response) =>{
    try{
        const providers = await prisma.provider.findMany()
        res.json(providers)
    }
    catch(err){
        console.log(err)
    }
}



const router = Router()
router.get('/getProviders', getProviders)

export default router