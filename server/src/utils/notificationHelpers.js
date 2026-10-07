import { Notification } from "../models/notification.model.js";

export const createNotification = async ({
  recipient,
  actor,
  type,
  ...target
}) => {
  if (!recipient || !actor || recipient.toString() === actor.toString()) return;

  try {
    await Notification.create({ recipient, actor, type, ...target });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};

export const createNotifications = async (notifications) => {
  const eligible = notifications.filter(
    ({ recipient, actor }) =>
      recipient && actor && recipient.toString() !== actor.toString()
  );
  if (!eligible.length) return;

  try {
    await Notification.insertMany(eligible, { ordered: false });
  } catch (error) {
    console.error("Failed to create notifications:", error);
  }
};

export const removeUnreadNotification = async ({
  recipient,
  actor,
  type,
  ...target
}) => {
  try {
    await Notification.findOneAndDelete({
      recipient,
      actor,
      type,
      readAt: null,
      ...target,
    });
  } catch (error) {
    console.error("Failed to remove notification:", error);
  }
};
