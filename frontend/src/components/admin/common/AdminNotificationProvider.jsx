import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import SplitText from "./SplitText";
import AdminNotificationContext from "./AdminNotificationContext";

const NOTIFICATION_STYLES = {
  success: {
    label: "Thành công",
    Icon: CheckCircle2,
    iconClass: "text-emerald-300",
    borderClass: "border-emerald-500/30",
  },
  error: {
    label: "Có lỗi xảy ra",
    Icon: AlertCircle,
    iconClass: "text-rose-300",
    borderClass: "border-rose-500/30",
  },
  warning: {
    label: "Cần chú ý",
    Icon: TriangleAlert,
    iconClass: "text-rose-400",
    borderClass: "border-rose-500/30",
  },
  info: {
    label: "Thông báo",
    Icon: Info,
    iconClass: "text-sky-300",
    borderClass: "border-sky-500/30",
  },
};

function AdminNotification({ notification, onDismiss }) {
  const style = NOTIFICATION_STYLES[notification.type] || NOTIFICATION_STYLES.info;
  const { Icon } = style;

  return (
    <section
      role={notification.type === "error" ? "alert" : "status"}
      aria-live={notification.type === "error" ? "assertive" : "polite"}
      className={`pointer-events-auto flex gap-3 rounded-2xl border ${style.borderClass} bg-neutral-900/95 p-4 text-neutral-100 shadow-2xl shadow-black/30 backdrop-blur-xl`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.iconClass}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <SplitText
          text={notification.title || style.label}
          tag="p"
          splitType="words"
          trigger="load"
          effect="fade"
          delay={35}
          duration={0.28}
          textAlign="left"
          className="text-sm font-semibold leading-5 text-white"
        />
        {notification.message && (
          <SplitText
            text={notification.message}
            tag="p"
            splitType="words"
            trigger="load"
            effect="fade"
            delay={18}
            duration={0.24}
            textAlign="left"
            className="mt-1 text-xs leading-5 text-neutral-300"
          />
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(notification.id)}
        aria-label="Đóng thông báo"
        className="-mr-1 -mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-neutral-500 transition hover:bg-neutral-800 hover:text-white focus-visible:outline-2 focus-visible:outline-amber-300"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </section>
  );
}

export default function AdminNotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const nextId = useRef(0);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
    setNotifications((current) => current.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    ({ type = "info", title, message, duration = 4200 } = {}) => {
      const id = ++nextId.current;
      setNotifications((current) => [...current, { id, type, title, message }]);
      if (duration > 0) {
        const timer = window.setTimeout(() => dismiss(id), duration);
        timers.current.set(id, timer);
      }
      return id;
    },
    [dismiss],
  );

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current.clear();
    },
    [],
  );

  return (
    <AdminNotificationContext.Provider value={{ notify, dismiss }}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-[100] flex w-[min(26rem,calc(100vw-2rem))] flex-col gap-3">
        {notifications.map((notification) => (
          <AdminNotification
            key={notification.id}
            notification={notification}
            onDismiss={dismiss}
          />
        ))}
      </div>
    </AdminNotificationContext.Provider>
  );
}
