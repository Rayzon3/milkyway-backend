import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import auth from "../middleware/auth";

const prisma = new PrismaClient();

const putOrderCoords = async (req: Request, res: Response) => {
  const { userID, lat, long } = req.body;

  try {
    const coordsData = await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        lat: lat,
        long: long,
      },
    });

    return res.json(coordsData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const createOrder = async (req: Request, res: Response) => {
  const { items, prices, providerID } = req.body;
  const user = res.locals.user.id;

  try {
    const orderData = await prisma.orders.create({
      data: {
        id: user,
        items: items,
        prices: prices,
        providerID: providerID,
      },
    });

    return res.json(orderData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getOrder = async (req: Request, res: Response) => {
  // const { items, prices, providerID } = req.body;
  const user = res.locals.user.id;

  try {
    const orderData = await prisma.orders.findFirst({
      where: {
        id: user,
      },
    });

    return res.json(orderData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const updateHistory = async (req: Request, res: Response) => {
  const { userID } = req.body;

  try {
    const userOrderData = await prisma.orders.update({
      where: {
        id: userID,
      },
      data: {
        history: true,
      },
    });

    return res.json(userOrderData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const addOrderInHistory = async (res: Response, req: Request) => {
  const { uID, pID, items, total } = req.body;

  try {
    const orderData = await prisma.orderHistory.create({
      data: {
        uID: uID,
        pID: pID,
        items: items,
        total: total,
      },
    });

    return res.json(orderData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getHistory = async (req: Request, res: Response) => {
  const userID = res.locals.user.id;

  try {
    const orderData = await prisma.orderHistory.findMany({
      where: {
        uID: userID,
      },
    });

    return res.json(orderData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const router = Router();
router.get("/userOrder", auth, getOrder);
router.post("/", auth, createOrder);
router.put("/coords", auth, putOrderCoords);
router.put("/setHistory", updateHistory);
router.post("/addHistory", addOrderInHistory);
router.post("/getUserOrderHistory", auth, getHistory);

export default router;
