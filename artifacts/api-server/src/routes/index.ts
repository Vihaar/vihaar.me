import { Router, type IRouter } from "express";
import healthRouter from "./health";
import stripeRouter from "./stripe";
import donorDetailsRouter from "./donor-details";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/stripe", stripeRouter);
router.use("/donor-details", donorDetailsRouter);

export default router;
