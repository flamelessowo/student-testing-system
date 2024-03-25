import { Notify } from 'quasar'

class NotifyService {

  success(message: string) {
    Notify.create({
      message,
      type: 'positive',
      position: 'bottom-left',
      timeout: 1500
    })
  };

  error(message: string) {
    Notify.create({
      message,
      type: 'negative',
      position: 'bottom-left',
      timeout: 2500
    })
  };

  warning(message: string) {
    Notify.create({
      message,
      type: 'warning',
      position: 'bottom-left',
      timeout: 2500
    })
  };

  info(message: string) {
    Notify.create({
      message,
      type: 'info',
      position: 'bottom-left',
      timeout: 2000
    })
  };
}

export function useNotifyService() {
  return new NotifyService();
}
