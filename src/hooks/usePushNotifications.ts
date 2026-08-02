import { useCallback, useState } from "react";
import api from "../lib/api";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

const urlBase64ToUint8Array = (base64String: string): ArrayBuffer => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);

  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray.buffer;
};

export const usePushNotifications = () => {
  const isSupported = "serviceWorker" in navigator && "PushManager" in window;

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const subscribe = useCallback(async (): Promise<void> => {
    if (!isSupported) return;

    setIsLoading(true);

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      setIsLoading(false);
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    await api.post("/push/subscribe", subscription.toJSON());

    setIsSubscribed(true);
    setIsLoading(false);
  }, [isSupported]);

  return {
    isSupported,
    isSubscribed,
    isLoading,
    subscribe,
  };
};