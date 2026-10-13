import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../features/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  selector: 'app-toolbar',
  styleUrl: './toolbar.css',
  templateUrl: './toolbar.html',
})

export class Toolbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isDarkMode = signal<boolean>(false)

  toggleTheme() {

    this.isDarkMode.update(current => !current);

    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  async logoutUser() {
    await this.authService.logout();

    this.authService.authenticationResource.update(() => null);

    await this.router.navigateByUrl('/auth/login');
  }
}