import { HttpParams, httpResource } from '@angular/common/http';
import { Service, signal } from '@angular/core';
import { PagedResult } from '../../../shared/paged.result';
import { StaffListItem } from '../models/staff.list.item';
import { environment } from '../../../../environments/environment.development';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom, take } from 'rxjs';

@Service()
export class StaffService {
    cursor = signal<string | null>(null);

    isLoadingMore = signal<boolean>(false);

    url: string = `${environment.apiUrl}/staffs`

    baseParams = new HttpParams().set('pagesize', 2)

    staffListResource = httpResource<PagedResult<StaffListItem>>(() => {
        const currentCursor = this.cursor();

        let params = this.baseParams;

        if (currentCursor !== null) {
            params = params.set('cursor', currentCursor)
        }

        return {
            url: this.url,
            params: params,
            credentials: 'include'
        }
    })

    status$ = toObservable(this.staffListResource.status)

    loadNextPage = async () => {
        try {
            this.isLoadingMore.set(true)

            const resource = this.staffListResource.value()

            if (!resource) return

            const nextCursorValue = resource.nextCursor
            const hasMoreValue = resource.hasMore

            if (typeof nextCursorValue !== 'string' || hasMoreValue !== true) return

            this.cursor.set(nextCursorValue);

            const isLoading = (status: string) =>
                status === 'loading'

            await firstValueFrom(
                this.status$.pipe(filter(isLoading), take(1))
            )

            const isFinished = (status: string) =>
                status === 'error' || status === 'resolved'

            await firstValueFrom(
                this.status$.pipe(filter(isFinished), take(1))
            )
        } finally {
            this.isLoadingMore.set(false)
        }
    }
}
