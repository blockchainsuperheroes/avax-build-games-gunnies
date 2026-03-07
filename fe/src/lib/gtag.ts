export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-QQHPT5Z8BS';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL) => {
  if (typeof window.gtag === 'function') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (
  action: string,
  {
    event_category,
    event_label,
    value,
  }: {
    event_category?: string;
    event_label?: string;
    value?: number;
  }
) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category,
      event_label,
      value,
    });
  }
};

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}
