import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, LoaderCircle } from "lucide-react";
import { getCurrentUser } from "../../redux/slices/authSlice";
import {
  clearNotifications,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../redux/slices/notificationSlice";

const notificationText = (notification) => {
  const actor =
    notification.actor?.fullName || notification.actor?.userName || "Someone";
  const videoTitle = notification.video?.title;

  switch (notification.type) {
    case "new_subscriber":
      return `${actor} subscribed to your channel`;
    case "new_video":
      return `${actor} published${videoTitle ? ` ${videoTitle}` : " a new video"}`;
    case "new_tweet":
      return `${actor} posted a new update`;
    case "new_comment":
      return `${actor} commented${videoTitle ? ` on ${videoTitle}` : " on your video"}`;
    case "video_like":
      return `${actor} liked${videoTitle ? ` ${videoTitle}` : " your video"}`;
    case "comment_like":
      return `${actor} liked your comment`;
    case "tweet_like":
      return `${actor} liked your post`;
    default:
      return `${actor} interacted with your channel`;
  }
};

const notificationTime = (date) => {
  const elapsed = Math.max(0, Date.now() - new Date(date).getTime());
  const minutes = Math.floor(elapsed / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
};

const NotificationBell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { notifications, unreadCount, isLoading, errorMessage } = useSelector(
    (state) => state.notifications,
  );
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated && localStorage.getItem("accessToken")) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(clearNotifications());
      return undefined;
    }
    dispatch(fetchNotifications());
    const refreshTimer = window.setInterval(() => {
      dispatch(fetchNotifications());
    }, 60000);
    return () => window.clearInterval(refreshTimer);
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!isOpen) return undefined;
    if (isAuthenticated) dispatch(fetchNotifications());
    const closeOnOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [dispatch, isAuthenticated, isOpen]);

  const openNotification = async (notification) => {
    if (!notification.readAt) {
      await dispatch(markNotificationRead(notification._id));
    }
    setIsOpen(false);

    if (notification.video?._id) {
      navigate(`/video/${notification.video._id}`);
    } else if (notification.type === "new_subscriber") {
      navigate("/your-channel/followers");
    }
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="relative rounded-full p-1.5 transition hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-accent sm:p-2"
        aria-label={
          unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"
        }
        aria-expanded={isOpen}
        aria-controls="notification-panel"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-[var(--accent)] px-1 text-center text-[10px] font-bold leading-4 text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <section
          id="notification-panel"
          aria-label="Notifications"
          className="absolute right-0 top-full z-[60] mt-3 flex max-h-[min(34rem,calc(100vh-6rem))] w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] shadow-xl"
        >
          <header className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
            <div>
              <h2 className="font-semibold">Notifications</h2>
              <p className="text-xs text-[var(--text-muted)]">
                {unreadCount ? `${unreadCount} unread` : "You’re all caught up"}
              </p>
            </div>
            {isAuthenticated && unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-[var(--accent)] hover:bg-[var(--surface-raised)]"
              >
                <CheckCheck size={15} /> Mark all read
              </button>
            )}
          </header>

          {!isAuthenticated ? (
            <div className="px-5 py-10 text-center">
              <p className="font-medium">Sign in to see your notifications</p>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/login");
                }}
                className="mt-3 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
              >
                Sign in
              </button>
            </div>
          ) : isLoading && notifications.length === 0 ? (
            <div className="flex items-center justify-center gap-2 px-5 py-10 text-sm text-[var(--text-muted)]">
              <LoaderCircle className="h-4 w-4 animate-spin" /> Loading
              notifications
            </div>
          ) : errorMessage ? (
            <div className="px-5 py-8 text-center text-sm text-red-500">
              {errorMessage}
              <button
                type="button"
                onClick={() => dispatch(fetchNotifications())}
                className="mt-3 block w-full font-semibold text-[var(--accent)]"
              >
                Try again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Bell className="mx-auto h-7 w-7 text-[var(--text-muted)]" />
              <p className="mt-3 font-medium">No notifications yet</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                New channel activity will appear here.
              </p>
            </div>
          ) : (
            <ul className="overflow-y-auto">
              {notifications.map((notification) => (
                <li key={notification._id}>
                  <button
                    type="button"
                    onClick={() => openNotification(notification)}
                    className={`flex w-full items-start gap-3 border-b border-[var(--border)] px-4 py-3 text-left transition hover:bg-[var(--surface-raised)] ${notification.readAt ? "" : "bg-[var(--accent)]/5"}`}
                  >
                    <img
                      src={notification.actor?.avatar || "/default-avatar.png"}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm leading-5">
                        {notificationText(notification)}
                      </span>
                      <time className="mt-1 block text-xs text-[var(--text-muted)]">
                        {notificationTime(notification.createdAt)}
                      </time>
                    </span>
                    {!notification.readAt && (
                      <span
                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]"
                        aria-label="Unread"
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
};

export default NotificationBell;
