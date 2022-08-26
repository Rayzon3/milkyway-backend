import { Request, Response, Router } from "express"
import { PrismaClient } from '@prisma/client'
import jwt from "jsonwebtoken"
import cookie from "cookie"


import providerAuth from "../middleware/providerAuth"
import auth from "../middleware/auth"


const prisma = new PrismaClient()

const registerProvider = async (req: Request, res: Response) => {
    const { name, pnum, email, password, address, district, state , lat, long} = req.body
    console.log(req.body)

    try {
        let errors: any = {}

        //validate data
        const userData = await prisma.provider.findFirst({
            where: { email: email }
        })
        if(userData) errors.userdata = "This user already exists!"

        if(Object.keys(errors).length > 0) {
            return res.status(400).json(errors)
        }
        
        //create provider
        const provider = await prisma.provider.create({
            data: {
              name: name,
              email: email,
              password: password,
              address: address,
              mobileNum:pnum,
              district: district,
              state: state,
              lat: lat,
              long: long,
            },
        })

        return res.json(provider)
    }catch(error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const loginProvider = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
        const user = await prisma.provider.findFirst({
            where: {
                email: email,
                password: password
            }
        })
    
        if(!user) return res.status(404).json({ loginError: "Wrong username and password combination !!" })

        //gen JWT
        const token = jwt.sign({ email }, process.env.JWT_SECRET!)
        //store JWT in cookie
        res.set("Set-Cookie", cookie.serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600,
            path: "/" //cookie valid for whole site
        }))

        return res.json({ email: email, token: token, name: user.name });

    }catch(error) {
        console.log(error)
        return res.json({ error: "Oops, that should not have happened :/ " })
    }
}

const providerPostMe = async (req: Request, res: Response) => {
    const { providerID} = req.body;
  
    try {
      const providerDetails = await prisma.provider.findFirst({
        where: {
            id:providerID,
        }
      });
  
      return res.json(providerDetails);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };

const logoutProvider = async (req: Request, res: Response) => {
    res.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
      })
    );
  
    return res.status(200).json({ logout: "true" });
}

const me = (req: Request, res: Response) => {
    return res.json(res.locals.provider);
};


const router = Router()
router.post("/registerProvider", registerProvider)
router.post("/loginProvider", loginProvider)
router.get("/providerMe", providerAuth, me)
router.post("/providerPostMe", providerPostMe)
router.get("/logoutProvider", providerAuth, logoutProvider)

export default router