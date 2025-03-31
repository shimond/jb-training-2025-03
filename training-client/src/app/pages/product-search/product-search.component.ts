import { Component, signal } from '@angular/core';
import { ProductListComponent } from "../../components/product-list/product-list.component";
import { ProductsApiService } from '../../services/products-api.service';
import { Product } from '../../models/product.model';
import { debounceTime, firstValueFrom, switchMap } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-search',
  imports: [ProductListComponent, ReactiveFormsModule],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss'
})
export class ProductSearchComponent {

  productsFromServer = signal<Product[]>([]);
  
  searchControl = new FormControl<string>('');

  constructor(private productApi: ProductsApiService) {
    this.searchControl.valueChanges
    .pipe(
      //debounceTime(300),
      switchMap(value=> this.productApi.getProducts(value) )).subscribe(result=>{
           this.productsFromServer.set(result);
      })

  }

  // async ngOnInit() {
  //   const res = await firstValueFrom(this.productApi.getProducts());
  //   this.productsFromServer.set(res);
  // }
}


// Implement:
// 1. Add new product - in new route
// 2. delete product



