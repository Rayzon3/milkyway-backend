import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import auth from "../middleware/auth";
import providerAuth from "../middleware/providerAuth";

const prisma = new PrismaClient();

const putItemsInStock = async (req: Request, res: Response) => {
  const { items, prices } = req.body;
  const provider = res.locals.provider.id;

  try {
    const orderData = await prisma.providerInStockItems.create({
      data: {
        id: provider,
        items: items,
        prices: prices,
      },
    });

    return res.json(orderData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const updateItemsInStock = async (req: Request, res: Response) => {
  const { items, prices } = req.body;
  const providerID = res.locals.provider.id;

  try {
    const updatedItems = await prisma.providerInStockItems.update({
      where: {
        id: providerID,
      },
      data: {
        items: items,
        prices: prices,
      },
    });

    return res.json(updatedItems);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getInStockItems = async (req: Request, res: Response) => {
  const { providerID } = req.body;
  try {
    const inStockData = await prisma.providerInStockItems.findFirst({
      where: {
        id: providerID,
      },
    });

    return res.json(inStockData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getInStockItemsPost = async (req: Request, res: Response) => {
  const { providerID } = req.body;
  try {
    const inStockData = await prisma.providerInStockItems.findFirst({
      where: {
        id: providerID,
      },
    });

    return res.json(inStockData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// const orderItemsForProvider = async (req: Request, res: Response) => {
//     const { userID, providerID, accepted, items, prices } = req.body

//     try{
//         const orderForProviderData = await prisma.provider.update({
//             where: {
//                 id: providerID
//             },
//             data: {
//                 c_id: userID,
//                 accepted: accepted,
//                 orderItems: items,
//                 orderPrices: prices
//             }
//         })
//         return res.json(orderForProviderData)
//     }catch (error){
//         console.log(error)
//         return res.status(500).json(error)
//     }

// }

const orderItemsForProvider = async (req: Request, res: Response) => {
  const { providerID, userID, items, prices, quant, total } = req.body;

  try {
    const orderData = await prisma.providerOrder.create({
      data: {
        providerID: providerID,
        userID: userID,
        items: items,
        prices: prices,
        quatities: quant,
        total: total,
      },
    });

    return res.json(orderData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getOrders = async (req: Request, res: Response) => {
  const providerID = res.locals.provider.id;

  try {
    const orders = await prisma.providerOrder.findMany({
      where: {
        providerID: providerID,
        accepted: false,
        history: false,
      },
    });

    return res.json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const acceptOrder = async (req: Request, res: Response) => {
  const { orderID } = req.body;

  try {
    const acceptedOrderData = await prisma.providerOrder.update({
      where: {
        id: orderID,
      },
      data: {
        accepted: true,
      },
    });

    return res.json(acceptedOrderData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getOrder = async (req: Request, res: Response) => {
  const { orderID } = req.body;

  try {
    const orderData = await prisma.providerOrder.findFirst({
      where: {
        id: orderID,
      },
    });

    return res.json(orderData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const putOrderInHistory = async (req: Request, res: Response) => {
  const { orderID } = req.body;

  try {
    const orderInHistoryData = await prisma.providerOrder.update({
      where: {
        id: orderID,
      },
      data: {
        history: true,
      },
    });
    return res.json(orderInHistoryData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getLiveOrders = async (req: Request, res: Response) => {
  const providerID = res.locals.provider.id;

  try {
    const orderData = await prisma.providerOrder.findMany({
      where: {
        providerID: providerID,
        accepted: true,
        history: false,
      },
    });

    return res.json(orderData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getOrderHistory = async (req: Request, res: Response) => {
  const providerID = res.locals.provider.id;

  try {
    const orderData = await prisma.providerOrder.findMany({
      where: {
        providerID: providerID,
        history: true,
      },
    });
    return res.json(orderData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const deleteOrder = async (res: Response, req: Request) => {
  const { userID } = req.body;

  try {
    const deleteOrder = await prisma.orders.delete({
      where: {
        id: userID,
      },
    });

    return res.json(deleteOrder);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const router = Router();
router.post("/", providerAuth, putItemsInStock);
router.post("/updateStock", providerAuth, updateItemsInStock);
router.get("/getStock", getInStockItems);
router.post("/getProviderItemsData", getInStockItemsPost);
router.post("/orderForProvider", orderItemsForProvider);
router.put("/acceptOrder", providerAuth, acceptOrder);
router.get("/getOrders", providerAuth, getOrders);
router.get("/getOrder", providerAuth, getOrder);
router.put("/putOrderInHistory", providerAuth, putOrderInHistory);
router.get("/getLiveOrder", providerAuth, getLiveOrders);
router.get("/getOrderHistory", providerAuth, getOrderHistory);
router.post("/deleteOrder", providerAuth, deleteOrder);
// router.post("/orderForProvider", auth, orderItemsForProvider)

export default router;
