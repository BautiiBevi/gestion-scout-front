import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent, // El Layout es el contenedor principal
    children: [
      { path: '', redirectTo: 'beneficiarios', pathMatch: 'full' },

      // Delegamos todas las rutas que empiecen con 'beneficiarios' a su propio archivo
      {
        path: 'beneficiarios',
        loadChildren: () =>
          import('./features/beneficiarios/beneficiarios.routes').then(
            (m) => m.beneficiariosRoutes,
          ),
      },

      // Delegamos todas las rutas que empiecen con 'familias' a su propio archivo
      {
        path: 'familias',
        loadChildren: () =>
          import('./features/familias/familias.routes').then((m) => m.familiasRoutes),
      },
    ],
  },

  // Si tuvieras un Login, va AFUERA del MainLayout para que no se vea la barra lateral
  // { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) }
];
