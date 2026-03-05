import { Routes } from '@angular/router';

export const familiasRoutes: Routes = [
  {
    path: '', // Equivale a /familias
    loadComponent: () =>
      import('./pages/familia-list-page/familia-list-page.component').then(
        (m) => m.FamiliaListComponent,
      ),
  },
  {
    path: 'nueva', // Equivale a /familias/nueva
    loadComponent: () =>
      import('./pages/familia-page/familia-page.component').then((m) => m.FamiliaPageComponent),
  },
  {
    path: 'editar/:id', // Equivale a /familias/editar/:id
    loadComponent: () =>
      import('./pages/familia-page/familia-page.component').then((m) => m.FamiliaPageComponent),
  },
];
