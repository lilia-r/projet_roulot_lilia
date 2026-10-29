import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Pollution } from './models/pollution.model';

// CE FICHIER SERT À :
// Remplacer le serveur
// Dès que notre application essaie d'envoyer un message sur internet, ce fichier l'intercepte.
// Il stocke les fausses données dans la mémoire de l'ordinateur et répond que cest ok
// pour que notre site fonctionne même sans vrai serveur.

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
  // L'intercepteur regarde l'adresse et la méthode de chaque requête.
  const url = req.url;
  const method = req.method;

  if (url.includes('/pollutions')) {
    // Cherche un identifiant à la fin de l'adresse, par exemple /pollutions/2.
    const idMatch = url.match(/\/pollutions\/(\d+)$/);
    const id = idMatch ? parseInt(idMatch[1], 10) : null;

    if (method === 'GET' && id !== null) {
      // GET avec un identifiant renvoie l'élément correspondant, ou une erreur 404.
      const item = mockPollutions.find((p) => p.id === id);
      return of(new HttpResponse({ status: item ? 200 : 404, body: item })).pipe(delay(200));
    }

    if (method === 'GET') {
      // GET sans identifiant renvoie une copie de toute la liste.
      return of(new HttpResponse({ status: 200, body: [...mockPollutions] })).pipe(delay(200));
    }

    if (method === 'POST') {
      // POST crée un identifiant, ajoute l'élément en tête de liste et le renvoie.
      const newPollution: Pollution = {
        ...(req.body as any),
        id: mockPollutions.length ? Math.max(...mockPollutions.map((p) => p.id)) + 1 : 1,
      };
      mockPollutions.unshift(newPollution);
      return of(new HttpResponse({ status: 201, body: newPollution })).pipe(delay(250));
    }

    if (method === 'PUT' && id !== null) {
      // PUT remplace les champs fournis si le signalement existe.
      const index = mockPollutions.findIndex((p) => p.id === id);
      if (index !== -1) {
        mockPollutions[index] = { ...mockPollutions[index], ...(req.body as any) };
        return of(new HttpResponse({ status: 200, body: mockPollutions[index] })).pipe(delay(200));
      }
      return of(new HttpResponse({ status: 404 })).pipe(delay(200));
    }

    if (method === 'DELETE' && id !== null) {
      // DELETE enlève le signalement de la liste simulée.
      mockPollutions = mockPollutions.filter((p) => p.id !== id);
      return of(new HttpResponse({ status: 200, body: { success: true, id } })).pipe(delay(200));
    }
  }

  // Les autres requêtes continuent vers leur destination habituelle.
  return next(req);
};
