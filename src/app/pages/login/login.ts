import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { disabled, email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Auth } from '../../services/auth';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';

@Component({
  imports: [MatCardModule, MatInputModule, MatIconModule, MatButtonModule, FormsModule, FormField, FormRoot, MatProgressSpinnerModule, MatFormFieldModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  loginModel = signal({
    email: '',
    password: ''
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email é obrigatório' });
    email(schemaPath.email, { message: 'Insira um endereço de email válido' });

    required(schemaPath.password, { message: 'Senha é obrigatório' });

    disabled(schemaPath, {
      when: ({ state }) => state.submitting()
    });
  },
    {
      submission: {
        action: async (field) => {
          const value = field().value();

          try {
            await this.auth.login(value);

            const returnUrl = history.state?.returnUrl;

            const safeUrl =
              typeof returnUrl === 'string' &&
                returnUrl.startsWith('/') &&
                !returnUrl.startsWith('//') &&
                !returnUrl.includes('\\')
                ? returnUrl
                : '/dashboard'

            await this.router.navigateByUrl(safeUrl);
          } catch (error) {
            if (error instanceof HttpErrorResponse && error.status === 401) {
              return ({ kind: "invalidCredentials", message: "Credenciais inválidas" })
            }
          }

          return;
        }
      }
    });

  isHidden = signal<boolean>(true);

  hidePassword() {
    this.isHidden.set(!this.isHidden());
  }
}
