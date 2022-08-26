import { Request, Response, Router } from "express"
import { PrismaClient } from '@prisma/client'
import jwt from "jsonwebtoken"
import cookie from "cookie"



import auth from "../middleware/auth"


const prisma = new PrismaClient()

const register = async (req: Request, res: Response) => {
    const { name, email, mobileNum, password, address, district, state } = req.body

    try {
        let errors: any = {}

        //validate data
        const user = await prisma.user.findFirst({
            where: { email: email }
        })
        if(user) errors.userdata = "This user already exists!"

        if(Object.keys(errors).length > 0) {
            return res.status(400).json(errors)
        }
        
        //create user
        const userData = await prisma.user.create({
            data: {
              name: name,
              email: email,
              mobileNum: mobileNum,
              password: password,
              address: address,
              district: district,
              state: state
            },
        })

        return res.json(userData)
    }catch(error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email,
                password: password
            }
        })
    
        if(!user) return res.status(404).json({ loginError: "Worng username and password combination !!" })

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

        return res.json(user);


    }catch(error) {
        console.log(error)
        return res.json({ erroe: "Oops, that should not have happened :/ " })
    }
}


const logout= async (req: Request, res: Response) => {
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
    return res.json(res.locals.user);
};

const postMe = async (req: Request, res: Response) => {
    const { uid} = req.body;
  
    try {
      const providerDetails = await prisma.user.findFirst({
        where: {
            id:uid,
        }
      });
  
      return res.json(providerDetails);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
};

const router = Router()
router.post("/register", register)
router.post("/login", login)
router.get("/me", auth, me)
router.get("/logout", auth, logout)
router.post("/postMe", postMe)


export default router