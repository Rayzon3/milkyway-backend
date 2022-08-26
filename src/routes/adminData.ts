import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import adminAuth from "../middleware/adminAuth";

const prisma = new PrismaClient()

const getDataDistrict = async (req: Request, res: Response) => {

    const { district } = req.body

    try{
        const data = await prisma.graphData.findMany({
            where: {
                district: district
            }
        })

        return res.json(data)
    }catch(error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const getDataState = async (req: Request, res: Response) => {
    const { state } = req.body

    try{
        const data = await prisma.graphData.findMany({
            where: {
                state: state
            }
        })

        return res.json(data)
    }catch(error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const getState = async (req: Request, res: Response) => {
    const { state } = req.body

    try{
        const data = await prisma.provider.findMany({
            where: {
                state: state
            }
        })

        return res.json(data)
    }catch(error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const getStateUser = async (req: Request, res: Response) => {
    const { state } = req.body

    try{
        const data = await prisma.user.findMany({
            where: {
                state: state
            }
        })

        return res.json(data)
    }catch(error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const router = Router()
router.get("/districtData", adminAuth, getDataDistrict)
router.get("/stateData", adminAuth, getDataState)
router.post("/state",getState)
router.post("/stateUser",getState)
export default router
