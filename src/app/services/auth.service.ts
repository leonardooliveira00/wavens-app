import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { Me } from '../models/auth/Me';

interface LoginData {
    email: string,
    password: string
}

@Service()
export class AuthService {
    private http = inject(HttpClient)

    url: string = `${environment.apiUrl}/auth`

    login(data: LoginData) {
        return firstValueFrom(this.http.post(
            `${this.url}/login`,
            data,
            { credentials: 'include' })
        )
    }

    logout() {
        return firstValueFrom(this.http.post(
            `${this.url}/logout`,
            null,
            { credentials: 'include' }
        ))
    }

    authenticationResource = httpResource<Me | null>(() => ({
        url: `${this.url}/me`,
        credentials: 'include'
    }))
}