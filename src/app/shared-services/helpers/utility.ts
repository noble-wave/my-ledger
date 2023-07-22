import { FormGroup } from '@angular/forms';

export class Utility {

  public static replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  public static markFormGroupTouched(formGroup: FormGroup) {
    if (formGroup) {
      (<any>Object).values(formGroup.controls).forEach(control => {
        control.markAsTouched();

        if (control.controls) {
          this.markFormGroupTouched(control);
        }
      });
    }
  }

}
