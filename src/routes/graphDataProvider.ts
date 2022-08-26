import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import providerAuth from "../middleware/providerAuth";

const prisma = new PrismaClient();

const insertGraphData = async (req: Request, res: Response) => {

    const { pH, dates, rates } = req.body

    const providerID = res.locals.provider.id

    try {
        const graphData = await prisma.provider.update({
            where: {
                id: providerID
            },
            data: {
                pH: pH,
                date: dates,
                rate: rates
            }
        })

        return res.json(graphData)
    }catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
}


const getGraphData = async (req: Request, res: Response) => {
    const providerID = res.locals.provide.id

    try{
        const graphData = await prisma.provider.findMany({
            where:{
                id: providerID
            }
        })

        return res.json(graphData)
    }catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
}


const router = Router()
router.post("/postGraphData", providerAuth, insertGraphData)
router.get("/getGraphData", providerAuth, getGraphData)

export default router