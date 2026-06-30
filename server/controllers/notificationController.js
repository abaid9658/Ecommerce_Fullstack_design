import Notification from '../models/Notification.js';

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [{ user: req.user._id }, { user: null }],
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { user, title, message, type } = req.body;
    const notification = await Notification.create({
      user: user || null,
      title,
      message,
      type: type || 'general',
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('new_notification', {
        title: notification.title,
        message: notification.message,
        type: notification.type,
      });
    }

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
