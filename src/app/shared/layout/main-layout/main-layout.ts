import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toolbar } from '../toolbar/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Navbar } from '../navbar/navbar';

@Component({
  imports: [RouterOutlet, Toolbar, MatSidenavModule, Navbar],
  selector: 'app-main-layout',
  styleUrl: './main-layout.css',
  templateUrl: './main-layout.html',
})
export class MainLayout {}
