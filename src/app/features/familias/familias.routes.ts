import { Routes } from '@angular/router';

export const FAMILIAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/familia-list-page/familia-list-page.component').then(
        (m) => m.FamiliaListComponent,
      ),
    title: 'Nómina de Familias',
  },
  {
    path: 'nueva',
    loadComponent: () =>
      import('./pages/familia-page/familia-page.component').then(
        (m) => m.FamiliaPageComponent,
      ),
    title: 'Nueva Familia',
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./pages/familia-page/familia-page.component').then(
        (m) => m.FamiliaPageComponent,
      ),
    title: 'Editar Familia',
  },
];
