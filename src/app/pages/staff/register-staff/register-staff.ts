import { Component, computed, effect, inject, signal } from '@angular/core';
import { form, FormRoot, FormField, required, minLength, maxLength, email, disabled, validateHttp, validate, maxDate, minDate } from '@angular/forms/signals';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { RegisterStaffData } from '../../../features/staff/models/register-staff-data';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StaffService } from '../../../features/staff/services/staff.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../../environments/environment.development';
import { ResetTouchedOnInput } from '../../../shared/directives/reset-touched-on-input';
import { MatDividerModule } from '@angular/material/divider';
import { RegistrationFormField } from '../../../features/staff/models/registration-form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateMask } from '../../../shared/directives/date-mask';

type StaffRegistrationFormModel = Omit<RegisterStaffData, 'birthDate'> & {
  birthDate: Date | null
}

const toDateOnly = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDay()).padEnd(2, '0');

  return `${year}-${month}-${day}`
}

@Component({
  imports: [MatFormFieldModule, FormRoot, FormField, MatCardModule, MatInputModule, MatIconModule, MatButtonModule, MatError, MatProgressSpinnerModule, ResetTouchedOnInput, MatDividerModule, MatDatepickerModule, DateMask],
  selector: 'app-register-staff',
  templateUrl: './register-staff.html',
})

export class RegisterStaff {
  private staffService = inject(StaffService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  private validatedEmails = new Set<string>()
  private validatedPhones = new Set<string>()

  readonly today = new Date()
  readonly minDate = new Date(new Date().getFullYear() - 120, 0, 1)

  readonly birthDateInput = signal<string>("")
  readonly isBirthDateComplete = computed<boolean>(() =>
    this.birthDateInput().length > 0 &&
    this.birthDateInput.length < 10)

  registerStaffModel = signal<StaffRegistrationFormModel>({
    firstName: '',
    lastName: '',
    birthDate: null,
    email: '',
    contactPhone: ''
  })

  fields: RegistrationFormField[] = [
    { key: 'firstName', label: 'Nome', placeholder: "ex: Leonardo", span: 1 },
    { key: 'lastName', label: 'Sobrenome', placeholder: "ex: de Oliveira", span: 1 },
    { key: 'birthDate', label: 'Data de nascimento', placeholder: "ex: 11/01/2000", span: 1 },
    { key: 'email', label: 'Email', placeholder: "ex: nome@email.com", span: 2, hasAvailabilityCheck: true },
    { key: 'contactPhone', label: 'Telefone', placeholder: "ex: (85) 91234-5678", span: 1, hasAvailabilityCheck: true }
  ]

  staffRegistrationForm = form(this.registerStaffModel, (schema) => {
    required(schema.firstName, { message: 'Nome é obrigatório.' })
    minLength(schema.firstName, 2, { message: 'Nome deve possuir no mínimo 2 caracteres.' })
    maxLength(schema.firstName, 50, { message: 'Nome deve possuir no máximo 50 caracteres.' })

    required(schema.lastName, { message: 'Sobrenome é obrigatório.' })
    minLength(schema.lastName, 2, { message: 'Sobrenome deve possuir no mínimo 2 caracteres.' })
    maxLength(schema.lastName, 50, { message: 'Sobrenome deve possuir no máximo 50 caracteres.' })

    required(schema.birthDate, {
      when: () => this.birthDateInput().length === 0,
      message: 'Data de nascimento é obrigatório.'
    })
    validate(schema.birthDate, ({ value }) => {
      const date = value()

      if (date === null) {
        if (this.birthDateInput().length === 0) return null

        return this.isBirthDateComplete()
          ? {
            kind: 'incompleteDate',
            message: 'Data incompleta.'
          }
          : {
            kind: 'invalidDate',
            message: 'Insira uma data válida.'
          }
      }

      if (Number.isNaN(date.getTime())) {
        return {
          kind: 'invalidDate',
          message: 'Insira uma data válida.'
        }
      }

      return null
    })
    minDate(schema.birthDate, this.minDate, { message: `A data de nascimento não pode ser anterior à ${this.minDate.getFullYear()}.` })
    maxDate(schema.birthDate, this.today, { message: 'A data de nascimento não pode ser futura.' })

    required(schema.email, { message: 'Email é obrigatório.' })
    email(schema.email, { message: 'Por favor, insira um formato de email válido.' })
    maxLength(schema.email, 255, { message: 'Email deve possuir no máximo 255 caracteres.' })

    required(schema.contactPhone, { message: 'Telefone é obrigatório.' })
    minLength(schema.contactPhone, 11, { message: 'Telefone deve possuir no mínimo 11 caracteres.' })
    maxLength(schema.contactPhone, 11, { message: 'Telefone deve possuir no máximo 11 caracteres.' })

    disabled(schema, {
      when: ({ state }) => state.submitting()
    })

    effect(() => {
      console.log(this.birthDateInput())
    })

    validateHttp(schema.email, {
      debounce: 400,

      request: ({ value }) => {
        const email = value()

        if (!email || this.validatedEmails.has(email)) return undefined

        return {
          url: `${environment.apiUrl}/staffs/validate-availability`,
          method: 'POST',
          body: {
            email: value(),
          },
          credentials: 'include',
        }
      },

      onSuccess: (response: { emailAvailable: boolean | null }, { value }) => {
        if (response.emailAvailable) {
          this.validatedEmails.add(value())
          return null
        }
        return {
          kind: 'emailAlreadyInUse',
          message: 'Email já cadastrado.'
        }
      },

      onError: () => ({
        kind: 'serverError',
        message: 'Não foi possível verificar o email'
      })
    });

    validateHttp(schema.contactPhone, {
      debounce: 400,

      request: ({ value }) => {
        const contactPhone = value()

        if (!contactPhone || this.validatedPhones.has(contactPhone)) return undefined

        return {
          url: `${environment.apiUrl}/staffs/validate-availability`,
          method: 'POST',
          body: {
            contactPhone: value(),
          },
          credentials: 'include',
        }
      },

      onSuccess: (response: { contactPhoneAvailable: boolean | null }, { value }) => {
        if (response.contactPhoneAvailable) {
          this.validatedPhones.add(value())
          return null
        }
        return {
          kind: 'phoneAlreadyInUse',
          message: 'Número de telefone já cadastrado.'
        }
      },

      onError: () => ({
        kind: 'serverError',
        message: 'Não foi possível verificar o número de telefone'
      })
    });
  }, {
    submission: {
      action: async (field) => {
        const value = field().value()

        if (value.birthDate == null) return;

        const payload = {
          ...value,
          birthDate: toDateOnly(value.birthDate)
        }

        try {
          await this.staffService.registerStaff(payload)

          await this.router.navigate(['..'], { relativeTo: this.route })
        } catch (error) {
          if (error instanceof HttpErrorResponse && error.status === 400) {
            return ({ kind: "invalidData", message: "Dados inválidos" })
          }

        }
        return
      }
    }
  })
}
