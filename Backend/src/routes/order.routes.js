import { Router } from "express";
import { getOrder } from "../controller/order.controller.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();

router.route("/order").post(upload.single("image"),getOrder);

export default router;
