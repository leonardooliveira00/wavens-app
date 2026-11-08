import { Routes } from '@angular/router';
import { MainLayout } from './shared/layout/main-layout/main-layout';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { ListStaffs } from './pages/staff/list-staffs/list-staffs';
import { RegisterStaff } from './pages/staff/register-staff/register-staff';
import { NotFound } from './pages/not-found/not-found';
import { authGuard } from './core/guards/auth-guard';

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
                children: [
                    {
                        path: '',
                        component: ListStaffs
                    },
                    {
                        path: 'new',
                        component: RegisterStaff
                    }
                ]
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
