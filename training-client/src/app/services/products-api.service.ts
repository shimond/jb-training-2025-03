import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsApiService {


  constructor(private httpClient: HttpClient) { }

  getProducts(q: string | null = null) {
    // pleaseeeeeeeeeee remove hardcoded url
    return this.httpClient.get<Product[]>('https://localhost:7147/api/products', {
      params: {
        q: q || ''
      }
    });
  }

}
