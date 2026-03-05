import { Routes } from '@angular/router';

export const beneficiariosRoutes: Routes = [
  {
    path: '', // Es la ruta base de beneficiarios (equivale a /beneficiarios)
    loadComponent: () =>
      import('./pages/beneficiario-list/beneficiario-list.component').then(
        (m) => m.BeneficiarioListComponent,
      ),
  },
  {
    path: 'rama/:rama', // <-- NUEVA RUTA DINÁMICA
    loadComponent: () =>
      import('./pages/beneficiario-list/beneficiario-list.component').then(
        (m) => m.BeneficiarioListComponent,
      ),
  },
  {
    path: 'nuevo', // Equivale a /beneficiarios/nuevo
    loadComponent: () =>
      import('./pages/beneficiario-page/beneficiario-page.component').then(
        (m) => m.BeneficiarioFormComponent,
      ),
  },
  {
    path: 'editar/:id', // Equivale a /beneficiarios/editar/:id
    loadComponent: () =>
      import('./pages/beneficiario-page/beneficiario-page.component').then(
        (m) => m.BeneficiarioFormComponent,
      ),
  },
];
