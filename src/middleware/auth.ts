import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config"

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async (req: Request, res: Response, next: NextFunction) => {
  try {

    const token = req.cookies.token;
    
    if (!token) throw new Error("No Token!");

    const { email }: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await prisma.user.findUnique({
      where: {email: email}
    })
    
    if (!user) throw new Error("No User!");

    res.locals.user = user;

    return next()
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Unauthenticated" });
  }
};
