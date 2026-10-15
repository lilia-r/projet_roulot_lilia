import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Requête interceptée :', req.url, req.method);

  if (req.method === 'POST') {
    const user = (req.body as any) || {};

    const mockResponse = new HttpResponse({
      status: 201,
      body: {
        message: 'Inscription validée avec succès !',
        user: {
          id: 101,
          name: user.name || 'Lilia Roulot',
          email: user.email || 'lilia@exemple.fr',
        },
      },
    });

    return of(mockResponse).pipe(delay(300));
  }

  return next(req);
};
