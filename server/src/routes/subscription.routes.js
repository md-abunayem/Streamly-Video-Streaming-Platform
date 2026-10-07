import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
} from "../controllers/subscription.controller.js";

const router = Router();

router
  .route("/channel/:channelId/subscribers")
  .get(verifyJWT, getUserChannelSubscribers);
router
  .route("/user/:subscriberId/channels")
  .get(verifyJWT, getSubscribedChannels);

router.route("/channel/:channelId/toggle").post(verifyJWT, toggleSubscription);

export default router;
