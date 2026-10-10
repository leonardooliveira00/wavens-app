import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Staff } from './pages/staff/staff';
import { NotFound } from './pages/not-found/not-found';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
    {
        path: 'auth/login',
        component: Login
    },
    {
        path: '404',
        component: NotFound
    },
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            {
                path: 'staff',
                component: Staff
            },
            {
                path: 'dashboard',
                component: Dashboard
            }
        ]
    },
    {
        path: '**',
        redirectTo: '404'
    }
];
