import { Routes } from '@angular/router';
import { noAuthGuard } from './core/guards/noAuth.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth/login',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/registro',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/auth/registro/registro.component').then(m => m.RegistroComponent)
  },
  {
    path: 'auth/olvide-password',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/auth/olvide-password/olvide-password.component').then(m => m.OlvidePasswordComponent)
  },
  {
    path: 'recuperar-password',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/auth/resetear-password/resetear-password.component').then(m => m.ResetearPasswordComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'tareas',
        loadComponent: () =>
          import('./features/tareas/lista-tareas/lista-tareas.component').then(m => m.ListaTareasComponent)
      },
      {
        path: 'catalogo',
        loadComponent: () =>
          import('./features/tareas/catalogo-tareas/catalogo-tareas.component').then(m => m.CatalogoTareasComponent)
      },
      {
        path: '',
        redirectTo: 'tareas',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'tareas'
  }
];