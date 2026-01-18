import * as amplitude from "@amplitude/analytics-browser";


const AMPLITUDE_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY;

amplitude.init(AMPLITUDE_KEY);

export const logEvent = (eventName: string, eventProperties?: Record<string, any>) => {
  amplitude.track(eventName, eventProperties);
};
