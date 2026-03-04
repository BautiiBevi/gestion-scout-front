import { Routes } from '@angular/router';

export const FAMILIAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/familia-list/familia-list.component').then(
        (m) => m.FamiliaListComponent,
      ),
    title: 'Nómina de Familias',
  },
  {
    path: 'nueva',
    loadComponent: () =>
      import('./components/familia-form/familia-form.component').then(
        (m) => m.FamiliaFormComponent,
      ),
    title: 'Nueva Familia',
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./components/familia-form/familia-form.component').then(
        (m) => m.FamiliaFormComponent,
      ),
    title: 'Editar Familia',
  },
];
