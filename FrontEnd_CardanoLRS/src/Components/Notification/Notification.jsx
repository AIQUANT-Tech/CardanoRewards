import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Notification.css";

// Function to generate dummy notifications
const generateDummyNotifications = () => {
  const notifications = [];
  const randomMessages = [
    "New user registered",
    "System update available, please restart",
    "Server status: All systems go",
    "You have 3 new messages in your inbox",
    "Database backup completed successfully",
    "Security breach detected, please check your account",
    "Your payment has been processed successfully",
    "New comment on your post",
    "Password change request received",
    "New friend request from John",
    "Account suspended due to suspicious activity",
    "You have a new follower",
    "New article published: 'How to optimize your workflow'",
    "Subscription renewal reminder",
    "New software update: Version 2.1.0 is now available",
    "New event scheduled for tomorrow: Team meeting at 10 AM",
    "You were tagged in a post",
    "New product available in the store",
    "Invoice #4567 has been generated",
    "New feature: Dark mode now available",
    "Your subscription to Premium plan has been activated",
    "Scheduled maintenance on Sunday at 2 AM",
    "You have a new message from support",
    "User feedback received: 5 stars rating",
    "New lead received: Contact Jane Doe",
    "Reminder: Complete your profile",
    "Account verification successful",
    "Low disk space warning: 10% remaining",
    "New comment on your product review",
    "Task reminder: Submit the report by 5 PM",
    "New job application received: Mark Wilson",
    "Scheduled backup completed successfully",
    "Service outage reported in your region",
    "Your order #12345 has been shipped",
    "Security alert: Login attempt from unknown device",
    "App usage exceeded daily limit",
    "Important announcement: System downtime for maintenance",
    "Password successfully changed",
    "Profile updated successfully",
    "New app version released",
    "Warning: Your account will expire in 3 days",
    "New message from CEO",
    "Your subscription is about to expire",
    "Access denied: Unauthorized login attempt",
    "API rate limit exceeded",
    "Your account has been temporarily locked",
    "Database query execution failed",
    "Error: Unable to process your request",
    "Payment failed for invoice #1234",
    "Account upgrade successful",
    "New document shared with you",
    "Your request for password reset has been approved",
    "Reminder: Meeting with the team in 30 minutes",
    "New meeting scheduled for Monday 9 AM",
    "App update complete, please restart",
    "Product review posted: 4.5 stars",
    "New version of your favorite plugin available",
    "Error: Failed to send email",
    "Successful login from a new device",
    "Scheduled report generation completed",
    "New task assigned to you",
    "New product review posted",
    "New social media activity: 5 new likes",
    "Sales report for last quarter has been published",
    "Your account balance has been updated",
    "System health check completed",
    "Important update: Data migration completed",
    "Reminder: Password expiration in 7 days",
    "Account successfully verified",
    "Your session will expire in 5 minutes",
    "Notification settings updated",
    "Access granted to the admin panel",
    "Product delivery expected within 3 days",
    "System alert: CPU usage exceeding 90%",
    "New file uploaded to your shared folder",
    "Reminder: Complete onboarding process",
    "Important security update available",
    "Application deployed successfully",
    "Database schema update completed",
    "Error: Invalid email format",
    "Your account has been restored",
    "Your email address has been updated",
    "System update completed successfully",
    "Security alert: Failed login attempt",
  ];

  for (let i = 1; i <= 70; i++) {
    notifications.push({
      id: i,
      text: `${
        randomMessages[Math.floor(Math.random() * randomMessages.length)]
      } `,
      read: i % 2 === 0, // Alternate between read and unread
    });
  }

  return notifications.reverse(); // Latest messages at the top
};

const Notifications = ({ onClose }) => {
  const [notificationList, setNotificationList] = useState(
    generateDummyNotifications()
  );
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Function to mark notification as read
  const markAsRead = (id) => {
    setNotificationList((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Function when a notification is clicked
  const handleNotificationClick = (notification) => {
    // Mark the notification as read when clicked
    markAsRead(notification.id);
    setSelectedNotification(notification);
  };

  const handleClosePopup = () => {
    setSelectedNotification(null);
  };

  // Function to clear a single notification
  const clearNotification = (id) => {
    setNotificationList((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  // Function to clear all notifications
  const clearAllNotifications = () => {
    setNotificationList([]);
  };

  return (
    <>
      <div className="blur-background" onClick={onClose}></div>
      <div className="notifications-popup">
        <div className="notifications-header">
          <h2>Notifications</h2>
          <button onClick={clearAllNotifications}>Clear All</button>
        </div>
        <ul className="notifications-list">
          {notificationList.map((notification) => (
            <li
              key={notification.id}
              className={notification.read ? "read" : "unread"}
              onClick={() => handleNotificationClick(notification)}
            >
              {!notification.read && <span className="unread-indicator"></span>}
              {notification.text}
            </li>
          ))}
        </ul>
        <div className="close-button">
          <button onClick={onClose}>Close</button>
        </div>
      </div>

      {selectedNotification && (
        <div className="notification-detail-popup">
          <div className="notification-detail-header">
            <h3>Notification Details</h3>
            <button onClick={handleClosePopup}>Close</button>
          </div>
          <div className="notification-detail-content">
            <p>{selectedNotification.text}</p>
          </div>
        </div>
      )}
    </>
  );
};

Notifications.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Notifications;
