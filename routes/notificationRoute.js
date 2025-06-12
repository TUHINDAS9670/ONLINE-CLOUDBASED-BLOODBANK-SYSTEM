// backend/routes/notificationRoutes.js

const express = require("express");
const router = express.Router();
const {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
} = require("../controllers/notificationController");

// @route   POST /api/notifications
// @desc    Create a new notification
router.post("/", createNotification);

// @route   GET /api/notifications/:recipientType/:recipientId
// @desc    Get all notifications for a user (Donor, Organisation, etc.)
router.get("/:recipientType/:recipientId", getUserNotifications);

// @route   PATCH /api/notifications/read/:id
// @desc    Mark a notification as read
router.patch("/read/:id", markNotificationAsRead);

module.exports = router;
