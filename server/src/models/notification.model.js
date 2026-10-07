import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "new_subscriber",
        "new_video",
        "new_tweet",
        "new_comment",
        "video_like",
        "comment_like",
        "tweet_like",
      ],
    },
    video: { type: Schema.Types.ObjectId, ref: "Video" },
    comment: { type: Schema.Types.ObjectId, ref: "Comment" },
    tweet: { type: Schema.Types.ObjectId, ref: "Tweet" },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, readAt: 1 });

export const Notification = mongoose.model("Notification", notificationSchema);
