import * as amplitude from "@amplitude/analytics-browser";

// Initialize with your Amplitude API key
amplitude.init("3a56c73c56d454e242ea6f8e9f98704e");

export const logEvent = (eventName: string, eventProperties?: Record<string, any>) => {
  amplitude.track(eventName, eventProperties);
};
