import { FormGroup } from "@angular/forms";
import { FormMeta } from "../models";
import { AppNotificationService } from "../services";

export class FormHelper {

  private static alertService: AppNotificationService; // init this when app init

  // call this method to initialize notification alerts
  public static notyInit(alertServie: AppNotificationService) {
    FormHelper.alertService = alertServie;
  }

  public static submit(form: FormGroup, formMeta: FormMeta, submitFunc: Function, doNotCheckPristine = false) {
    formMeta.serverErrorMessage = undefined;
    formMeta.successMessage = undefined;
    formMeta.isFireValidation = true;
    formMeta.submitProcessing = true;

    if (!form.invalid) {
      try {
        if (form.pristine && !doNotCheckPristine) {
          formMeta.submitProcessing = false;
          console.log('Form is unchanged');
          FormHelper.alertService.notifyNoChange('Form is unchanged', 'Info');
        } else {
          submitFunc();
        }
      } catch (e) {
        formMeta.submitProcessing = false;
        console.log('Server is not reachable');
      }
    } else {
      formMeta.submitProcessing = false;
      console.log('Invalid form could not be submit');
      if (FormHelper.alertService) {
        FormHelper.alertService.notifyError('Invalid form could not be submit', 'Error');
      }

    }
  }
}
