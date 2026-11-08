import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ErrorStateMatcher } from '@angular/material/core';
import { ShowOnDirtyOrTouchedErrorStateMatcher } from './shared/error-state-matcher';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),

    {
      provide: ErrorStateMatcher,
      useClass: ShowOnDirtyOrTouchedErrorStateMatcher
    }
  ]
};
