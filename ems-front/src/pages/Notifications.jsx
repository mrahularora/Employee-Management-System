import { useState } from "react";
import { useQuery } from "@apollo/client";
import EmployeeFooter from "../components/EmployeeFooter";
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import { getNotificationsReadAt, markNotificationsRead } from "../auth";
import { GET_NOTIFICATIONS } from "../graphql/queries";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const actionLabel = (action) => action.replaceAll("_", " ").toLowerCase();

const Notifications = () => {
  const [readAt, setReadAt] = useState(getNotificationsReadAt);
  const { data, loading, error } = useQuery(GET_NOTIFICATIONS);
  const notifications = data?.notifications || [];
  const unread = notifications.filter(({ createdAt }) => new Date(createdAt).getTime() > readAt).length;

  const handleMarkRead = () => setReadAt(markNotificationsRead());

  return (
    <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <section className="ems-home-hero">
        <p className="ems-kicker">Organization updates</p>
        <h1>Notifications</h1>
        <p>See recent employee, community, and recreation changes across EMS.</p>
      </section>
      <div className="ems-container notifications-page">
        <div className="notifications-toolbar">
          <strong>{unread} unread</strong>
          <button type="button" className="ems-button secondary" onClick={handleMarkRead} disabled={!unread}>
            Mark All Read
          </button>
        </div>
        {loading && <p className="ems-section-note">Loading notifications...</p>}
        {error && <p className="error-message">Unable to load notifications.</p>}
        {!loading && !error && (
          notifications.length ? (
            <ol className="notification-list">
              {notifications.map((notification) => {
                const isUnread = new Date(notification.createdAt).getTime() > readAt;
                return (
                  <li key={notification.id} className={isUnread ? "unread" : ""}>
                    <div>
                      <div className="notification-item-heading">
                        <span className="notification-action">{actionLabel(notification.action)}</span>
                        {isUnread && <span className="notification-new">New</span>}
                      </div>
                      <p>{notification.message}</p>
                    </div>
                    <time dateTime={notification.createdAt}>{dateFormatter.format(new Date(notification.createdAt))}</time>
                  </li>
                );
              })}
            </ol>
          ) : <p className="ems-section-note">No notifications yet.</p>
        )}
      </div>
      <EmployeeFooter />
    </div>
  );
};

export default Notifications;
