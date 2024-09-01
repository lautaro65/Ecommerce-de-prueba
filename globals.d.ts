// @types/modo.d.ts

interface ModoSDK {
  modoInitPayment(modalObject: {
    qrString: string;
    checkoutId: string;
    deeplink: {
      url: string;
      callbackURL: string;
      callbackURLSuccess: string;
    };
    callbackURL: string;
    refreshData: () => Promise<any>;
    onSuccess?: () => void;
    onFailure?: () => void;
    onCancel?: () => void;
    onClose?: () => void;
  }): void;
}

declare global {
  interface Window {
    ModoSDK: ModoSDK;
  }
}

export {};
