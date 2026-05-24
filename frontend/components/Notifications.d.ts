export type NotificationType = 'success' | 'error' | 'warning' | 'info';
interface NotificationProps {
    id: string;
    type: NotificationType;
    message: string;
    duration?: number;
    onClose?: (id: string) => void;
}
export declare function Notification({ id, type, message, duration, onClose, }: NotificationProps): import("react").JSX.Element;
export declare function NotificationContainer({ notifications, onClose, }: {
    notifications: Array<NotificationProps & {
        id: string;
    }>;
    onClose: (id: string) => void;
}): import("react").JSX.Element;
export declare function useNotifications(): {
    notifications: (NotificationProps & {
        id: string;
    })[];
    add: (type: NotificationType, message: string, duration?: number) => string;
    remove: (id: string) => void;
    success: (message: string) => string;
    error: (message: string) => string;
    warning: (message: string) => string;
    info: (message: string) => string;
};
export {};
//# sourceMappingURL=Notifications.d.ts.map