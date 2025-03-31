import { Routes } from '@angular/router';

export const routes: Routes = [
    {path:'products', loadComponent: () => import('./pages/product-search/product-search.component').then(m => m.ProductSearchComponent)},
    {path:'', redirectTo: 'products', pathMatch: 'full'},
];
