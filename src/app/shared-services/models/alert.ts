export class IAlert {
  message: string;
  title?: string;
  okAction: () => any;
  okLabel?: string;
}

export class IConfirm extends IAlert {
  cancelAction?: () => any;
  cancelLabel?: string;
}

