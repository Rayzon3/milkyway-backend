import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import multer from "multer";
import path from "path";
import adminAuth from "../middleware/adminAuth";
import auth from "../middleware/auth";
import makeId from "../util/helper";

const prisma = new PrismaClient();

const imageStorage = multer.diskStorage({
  destination: function (req: Request, file, callback) {
    callback(null, "../../img/milkTest");
  },
  filename: function (req, file, callback) {
    const name = makeId(15);
    callback(null, name + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: { mimetype: string }, callback: any) => {
  if (file.mimetype === "image/jpeg" || "image/png") {
    callback(null, true);
  } else {
    callback(new Error("The image file must be jpeg or png !!"), false);
  }
};

const upload = multer({
  storage: imageStorage,
  limits: {
    fieldNameSize: 1024 * 1024 * 5, //file size limit 5MB
  },
  fileFilter: fileFilter,
});

const uploadTestImageUser = async (req: Request, res: Response) => {
  const userID = res.locals.user.id;

  try {
    const type = req.body.type;
    if (type !== "image") {
      return res.status(400).json({ error: "Wrong file type!!" });
    }
    const imgUrn = req.file?.filename;
    const imageData = await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        imageUrn: imgUrn,
      },
    });

    res.json(imageData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const uploadTestImageAdmin = async (req: Request, res: Response) => {
    const adminID = res.locals.admin.id;
  
    try {
      const type = req.body.type;
      if (type !== "image") {
        return res.status(400).json({ error: "Wrong file type!!" });
      }
      const imgUrn = req.file?.filename;
      const imageData = await prisma.user.update({
        where: {
          id: adminID,
        },
        data: {
          imageUrn: imgUrn,
        },
      });
  
      res.json(imageData);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };
  

const router = Router()
router.post("/userUpload", auth, upload.single("file"), uploadTestImageUser)
router.post("/adminUpload", adminAuth, upload.single("file"), uploadTestImageAdmin)

export default router