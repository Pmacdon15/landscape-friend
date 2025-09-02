export interface FCMContextType {
    permissionStatus: NotificationPermission | 'not-supported';
    fcmToken: string | null;
    loading: boolean;
    requestNotificationPermissionAndToken: () => Promise<void>;
}
