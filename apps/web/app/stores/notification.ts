import { defineStore } from 'pinia';

interface iNotification {
  id: string;
  version: 'success' | 'warning' | 'error',
  message: string;
}

interface iNotificationParam {
  version: 'success' | 'warning' | 'error',
  message: string;
  timeout?: number;
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<iNotification[]>([]);

  const addNotification = (notification: iNotificationParam) => {
    const id = generateRandomId();

    const newNotification: iNotification = {
      id,
      version: notification.version,
      message: notification.message
    }
    notifications.value.push(newNotification)

    const timeout = notification.timeout || 3;

    setTimeout(() => {
      const indexToRm = notifications.value.findIndex((n) => n.id === id);
      notifications.value.splice(indexToRm, 1)
    }, timeout * 1000)
  }

  return { notifications, addNotification };
})

function generateRandomId(): string {
  let randomId = '';
  const characters = '0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < 4; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return randomId;
}