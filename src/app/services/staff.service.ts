import { Service } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { StaffItem } from '../models/Staff';
import { environment } from '../../environments/environment.development';

@Service()
export class StaffService {
    staffResource = httpResource<StaffItem[]>(() => ({
        url: `${environment.apiUrl}/staffs`,
        credentials: 'include'
    }))
}
