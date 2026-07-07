const crypto = require('crypto');

class Notification {
  constructor({ id, userId, type, title, message, read = false, createdAt }) {
    this.id = id || crypto.randomUUID();
    this.userId = userId;
    this.type = type;
    this.title = title;
    this.message = message;
    this.read = read;
    this.createdAt = createdAt || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      title: this.title,
      message: this.message,
      read: this.read,
      createdAt: this.createdAt
    };
  }
}

module.exports = Notification;
