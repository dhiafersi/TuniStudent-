import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloak = inject(KeycloakService);

  // Skip if it's an asset or keycloak related (though keycloak-angular handles exclusion usually)
  if (req.url.includes('/assets/') || req.url.includes('/realms/')) {
    return next(req);
  }

  return from(keycloak.getToken()).pipe(
    switchMap(token => {
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      return next(req);
    })
  );
};
