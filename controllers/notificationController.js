// backend/controllers/notificationController.js

const Notification = require("../models/notificationModel");

// CREATE a notification
const createNotification = async (req, res) => {
  try {
    const {
      recipientType,
      recipientId,
      title,
      message,
      link,
      priority,
      relatedRequestId,
    } = req.body;

    if (!recipientType || !recipientId || !title || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const notification = new Notification({
      recipientType,
      recipientId,
      title,
      message,
      link,
      priority,
      relatedRequestId,
    });

    await notification.save();
    res.status(201).json({ success: true, notification });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET all notifications for a specific user
const getUserNotifications = async (req, res) => {
  try {
    const { recipientType, recipientId } = req.params;

    const notifications = await Notification.find({
      recipientType,
      recipientId,
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// MARK a notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, notification: updated });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
};
