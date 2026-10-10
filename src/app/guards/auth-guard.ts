import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router, RouterStateSnapshot } from '@angular/router';
import { Auth } from '../services/auth';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom, take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const resource = authService.authenticationResource;

  var status = toObservable(resource.status);

  const isFinished = (status: string) =>
    status === 'resolved' || status === 'error';

  const isLoading = (status: string) =>
    status === 'loading' || status === 'reloading';

  const currentStatus = resource.status();

  if (currentStatus === 'idle' || isLoading(currentStatus)) {
    await firstValueFrom(
      status.pipe(filter(isFinished), take(1))
    )
  } else {
    const reloadStarted = resource.reload();

    if (reloadStarted) {
      await firstValueFrom(
        status.pipe(filter(isLoading), take(1))
      )
    }

    await firstValueFrom(
      status.pipe(filter(isFinished), take(1))
    )
  }

  if (resource.status() === 'resolved' && resource.hasValue()) return true;

  const error = resource.error();

  if (error instanceof HttpErrorResponse && error.status === 401) {
    return new RedirectCommand(
      router.createUrlTree(['/auth/login']),
      {
        state: { returnUrl: state.url }
      }
    )
  }

  return false;
};
