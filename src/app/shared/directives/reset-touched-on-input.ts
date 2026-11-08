import { contentChildren, Directive } from '@angular/core';
import { FormField } from '@angular/forms/signals';

@Directive({
  selector: '[appResetTouchedOnInput]',
  host: {
    '(input)': 'onInput($event)',
  }
})
export class ResetTouchedOnInput {
  private formFields = contentChildren(FormField, {
    descendants: true
  })

  onInput(event: Event) {
    const field = this.formFields().find(
      field => field.element === event.target
    );

    field?.state().reset();
  }
}
