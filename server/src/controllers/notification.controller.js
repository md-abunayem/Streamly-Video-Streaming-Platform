import { isValidObjectId } from "mongoose";
import { Notification } from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getNotifications = asyncHandler(async (req, res) => {
  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("actor", "fullName userName avatar")
      .populate("video", "title thumbnail")
      .populate("comment", "content")
      .populate("tweet", "content")
      .lean(),
    Notification.countDocuments({ recipient: req.user._id, readAt: null }),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { notifications, unreadCount },
        "Notifications fetched successfully"
      )
    );
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  if (!isValidObjectId(notificationId)) {
    throw new ApiError(400, "Invalid notification id");
  }

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: req.user._id, readAt: null },
    { $set: { readAt: new Date() } },
    { new: true }
  );

  if (!notification) {
    const exists = await Notification.exists({
      _id: notificationId,
      recipient: req.user._id,
    });
    if (!exists) throw new ApiError(404, "Notification not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, notification, "Notification marked as read"));
});

const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, readAt: null },
    { $set: { readAt: new Date() } }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { unreadCount: 0 },
        "All notifications marked as read"
      )
    );
});

export { getNotifications, markNotificationRead, markAllNotificationsRead };
