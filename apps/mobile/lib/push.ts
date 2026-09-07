import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { createApiClient } from "./api";
import { getAccessToken } from "./auth";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

export async function requestPushPermissions(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  const ask = await Notifications.requestPermissionsAsync();
  return ask.granted;
}

export async function getPushToken(): Promise<string | null> {
  try {
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch {
    return null;
  }
}

export async function registerDeviceForPush(): Promise<boolean> {
  const granted = await requestPushPermissions();
  if (!granted) return false;

  const token = await getPushToken();
  if (!token) return false;

  const api = createApiClient({ getToken: getAccessToken });
  await api.users.registerDevice({
    token,
    platform: Platform.OS === "ios" || Platform.OS === "android" ? Platform.OS : "web",
    pushEnabled: true
  });

  return true;
}
