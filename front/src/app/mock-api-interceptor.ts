import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Pollution } from './models/pollution.model';

let mockPollutions: Pollution[] = [
  {
    id: 1,
    titre: 'Décharge sauvage en forêt',
    type: 'Déchets',
    description: 'Pneus et gravats abandonnés près du sentier.',
    dateObservation: '2026-10-12',
    lieu: 'Forêt de Haguenau',
    latitude: 48.815,
    longitude: 7.788,
  },
  {
    id: 2,
    titre: "Déversement suspect dans cours d'eau",
    type: 'Chimique',
    description: 'Nappe irisée avec odeur d hydrocarbure observée.',
    dateObservation: '2026-10-14',
    lieu: 'Bassin de l Ill',
    latitude: 48.583,
    longitude: 7.745,
  },
  {
    id: 3,
    titre: 'Fumées noires industrielles anormales',
    type: 'Air',
    description: 'Émanations denses et persistantes observées à l aube.',
    dateObservation: '2026-10-15',
    lieu: 'Zone portuaire Strasbourg',
    latitude: 48.567,
    longitude: 7.789,
  },
];

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url;
  const method = req.method;

  if (url.includes('/pollutions')) {
    const idMatch = url.match(/\/pollutions\/(\d+)$/);
    const id = idMatch ? parseInt(idMatch[1], 10) : null;

    if (method === 'GET' && id !== null) {
      const item = mockPollutions.find((p) => p.id === id);
      return of(new HttpResponse({ status: item ? 200 : 404, body: item })).pipe(delay(200));
    }

    if (method === 'GET') {
      return of(new HttpResponse({ status: 200, body: [...mockPollutions] })).pipe(delay(200));
    }

    if (method === 'POST') {
      const newPollution: Pollution = {
        ...(req.body as any),
        id: mockPollutions.length ? Math.max(...mockPollutions.map((p) => p.id)) + 1 : 1,
      };
      mockPollutions.unshift(newPollution);
      return of(new HttpResponse({ status: 201, body: newPollution })).pipe(delay(250));
    }

    if (method === 'PUT' && id !== null) {
      const index = mockPollutions.findIndex((p) => p.id === id);
      if (index !== -1) {
        mockPollutions[index] = { ...mockPollutions[index], ...(req.body as any) };
        return of(new HttpResponse({ status: 200, body: mockPollutions[index] })).pipe(delay(200));
      }
      return of(new HttpResponse({ status: 404 })).pipe(delay(200));
    }

    if (method === 'DELETE' && id !== null) {
      mockPollutions = mockPollutions.filter((p) => p.id !== id);
      return of(new HttpResponse({ status: 200, body: { success: true, id } })).pipe(delay(200));
    }
  }

  return next(req);
};
