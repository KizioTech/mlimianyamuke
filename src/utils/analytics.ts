// Simple event tracking without external dependencies

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

class Analytics {
  private events: AnalyticsEvent[] = [];

  track(name: string, properties?: Record<string, any>) {
    const event = {
      name,
      properties,
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);
    console.log('Analytics:', event);

    // Send to backend if needed
    const apiUrl = import.meta.env?.REACT_APP_API_URL || (typeof process !== 'undefined' ? process.env?.REACT_APP_API_URL : null);
    if (apiUrl) {
      fetch(`${apiUrl}/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      }).catch(console.error);
    }
  }

  page(pageName: string) {
    this.track('page_view', { page: pageName });
  }
}

export const analytics = new Analytics();