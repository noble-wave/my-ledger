import { FormControl } from "@angular/forms";

export class ModelMeta {
  // nested controls
  obj?: Array<ModelMeta>;

  // control
  key: string;
  controlType?: controlType;
  options?: { key: any, value: any }[];

  // about control
  label?: string;
  desc?: string;
  hint?: string;
  icon?: string;
  hide?: boolean;
  disabled: boolean;
  order?: number;

  // validation
  required: boolean;
  requiredTrue: boolean;
  email: boolean;
  minLength: number;
  maxLength: number;
  validateEqual: string;
  pattern: any;
  errorMessage: string;

  constructor(options: {
    obj?: Array<ModelMeta>,
    key: string,
    controlType?: controlType;
    required?: boolean,
    requiredTrue?: boolean,
    email?: boolean,
    minLength?: number,
    maxLength?: number,
    validateEqual?: string,
    pattern?: any,
    errorMessage?: string,
    disabled?: boolean,
    label?: string,
    desc?: string,
    hint?: string,
    icon?: string,
    hide?: boolean,
    order?: number,
    options?: { key: any, value: any }[];

  }) {
    this.key = options.key;
    this.obj = options.obj;

    this.required = options.required || false;
    this.requiredTrue = options.requiredTrue || false;
    this.email = options.email || false;
    this.disabled = options.disabled || false;

    if (options.minLength) {
      this.minLength = options.minLength;
    }
    if (options.maxLength) {
      this.maxLength = options.maxLength;
    }
    if (options.validateEqual) {
      this.validateEqual = options.validateEqual;
    }
    if (options.pattern) {
      this.pattern = options.pattern;
    }
    if (options.errorMessage) {
      this.errorMessage = options.errorMessage;
    }

    this.options = options.options || [];

    this.controlType = options.controlType || 'text';

    this.label = options.label;
    this.desc = options.desc;
    this.order = options.order;
  }

}

type controlType = 'text' | 'dropdown' | 'radio' | 'date' | 'number';

export class IrsControl extends FormControl {
  label: string;
  desc: string;
}


