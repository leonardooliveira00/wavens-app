import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_LOCALE } from '@angular/material/core';
import { ShowOnDirtyOrTouchedErrorStateMatcher } from './shared/error-state-matcher';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { ptBR } from 'date-fns/locale';
import { StrictDateFnsAdapter } from './shared/strict-date-fns-adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideDateFnsAdapter({
      parse: {
        dateInput: 'dd/MM/yyyy'
      },
      display: {
        dateInput: 'dd/MM/yyyy',
        monthYearLabel: 'MMM yyyy',
        dateA11yLabel: 'dd/MM/yyyy',
        monthYearA11yLabel: 'MMM yyyy'
      }
    }),
    { provide: DateAdapter, useClass: StrictDateFnsAdapter },
    { provide: MAT_DATE_LOCALE, useValue: ptBR },
    {
      provide: ErrorStateMatcher,
      useClass: ShowOnDirtyOrTouchedErrorStateMatcher
    }
  ]
};
