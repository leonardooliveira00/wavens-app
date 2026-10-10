import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

interface LoginData {
    email: string,
    password: string
}

@Service()
export class Auth {
    private http = inject(HttpClient)

    login(data: LoginData) {
        return firstValueFrom(this.http.post(
            `${environment.apiUrl}/auth/login`,
            data,
            { credentials: 'include' })
        )
    }

    logout() {
        return firstValueFrom(this.http.post(
            `${environment.apiUrl}/auth/logout`,
            null,
            { credentials: 'include' }
        ))
    }

    authenticationResource = httpResource(() => ({
        url: `${environment.apiUrl}/auth/me`,
        credentials: 'include'
    }))
}
