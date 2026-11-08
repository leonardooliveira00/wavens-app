import { Component, inject, signal } from '@angular/core';
import { form, FormRoot, FormField, required, minLength, maxLength, email, disabled, validateHttp } from '@angular/forms/signals';
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

@Component({
  imports: [MatFormFieldModule, FormRoot, FormField, MatCardModule, MatInputModule, MatIconModule, MatButtonModule, MatError, MatProgressSpinnerModule, ResetTouchedOnInput, MatDividerModule],
  selector: 'app-register-staff',
  templateUrl: './register-staff.html',
})
export class RegisterStaff {
  private staffService = inject(StaffService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  registerStaffModel = signal<RegisterStaffData>({
    firstName: '',
    lastName: '',
    email: '',
    contactPhone: ''
  })

  private validatedEmails = new Set<string>()
  private validatedPhones = new Set<string>()

  staffRegistrationForm = form(this.registerStaffModel, (schema) => {
    required(schema.firstName, { message: 'Nome é obrigatório.' })
    minLength(schema.firstName, 2, { message: 'Nome deve possuir no mínimo 2 caracteres.' })
    maxLength(schema.firstName, 50, { message: 'Nome deve possuir no máximo 50 caracteres.' })

    required(schema.lastName, { message: 'Sobrenome é obrigatório.' })
    minLength(schema.lastName, 2, { message: 'Sobrenome deve possuir no mínimo 2 caracteres.' })
    maxLength(schema.lastName, 50, { message: 'Sobrenome deve possuir no máximo 50 caracteres.' })

    required(schema.email, { message: 'Email é obrigatório.' })
    email(schema.email, { message: 'Por favor, insira um formato de email válido.' })
    maxLength(schema.email, 255, { message: 'Email deve possuir no máximo 255 caracteres.' })

    required(schema.contactPhone, { message: 'Telefone é obrigatório.' })
    minLength(schema.contactPhone, 11, { message: 'Telefone deve possuir no mínimo 11 caracteres.' })
    maxLength(schema.contactPhone, 11, { message: 'Telefone deve possuir no máximo 11 caracteres.' })

    disabled(schema, {
      when: ({ state }) => state.submitting()
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

        try {
          await this.staffService.registerStaff(value)

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
