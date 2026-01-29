import React, { useEffect, useState } from "react";
import { get, post } from "../../../utilities";
import "./SidebarNotifications.css";

interface Notification {
  _id: string;
  previewText: string;
  type: string;
  read: boolean;
}

export default function SidebarNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    get("/api/notification").then((data) => {
      setNotifications(data);
      post("/api/notification/read");
    });
  }, []);

  return (
    <div className="notifications-container">
      <h3>Notifications</h3>
      {notifications.length === 0 ? (
        <p className="no-notifs">No new notifications.</p>
      ) : (
        <div className="notif-list">
          {notifications.map((notif) => (
            <div key={notif._id} className={`notif-item ${!notif.read ? "unread" : ""}`}>
              <p>{notif.previewText || "New interaction"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
