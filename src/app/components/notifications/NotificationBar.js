export default function Notifications({ notifications }) {
    if (notifications.length === 0) {
      return null; // No notifications to display
    }
  
    return (
      <div className="notifications-container">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="notification-bar"
            style={{
              backgroundColor: notification.backgroundColor,
              color: notification.textColor,
            }}
          >
            <div className="notification-content">
              <h4>{notification.title}</h4>
              <p>{notification.message}</p>
              {notification.url && (
                <a href={notification.url} style={{ color: notification.textColor }}>
                  Learn more
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
  