import { Component } from '@angular/core';
import { MatNavList, MatListItem, MatListItemTitle, MatListItemIcon } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavigationItem {
  label: string,
  icon: string,
  route: string
}

@Component({
  imports: [MatNavList, MatListItem, MatIcon, MatListItemTitle, MatListItemIcon, MatButtonModule, RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})

export class Navbar {
  navigationItems: NavigationItem[] = [
    {
      label: "Dashboard",
      icon: "dashboard",
      route: "/dashboard"
    },
    {
      label: "Colaboradores",
      icon: "groups",
      route: "/staff"
    },
    {
      label: "Usuários",
      icon: "alternate_email",
      route: "/users"
    },
    {
      label: "Publicações",
      icon: "newspaper",
      route: "/publications"
    }
  ]
}
