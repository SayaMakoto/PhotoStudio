import { useContext } from "react";
import AdminNotificationContext from "./AdminNotificationContext";

export default function useAdminNotification() {
  const context = useContext(AdminNotificationContext);
  if (!context) {
    throw new Error(
      "useAdminNotification phải được gọi bên trong AdminNotificationProvider.",
    );
  }
  return context;
}
