/// <reference types="next" />

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: (
            callback?: (notification: { isNotDisplayed: () => boolean }) => void,
          ) => void;
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export {};
