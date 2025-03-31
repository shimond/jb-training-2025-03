import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductsApiService } from './services/products-api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'training-client';
  constructor(private productsApiService: ProductsApiService) {
    this.productsApiService.getProducts();
  }
}


//Component - new Html Element
//Input
//Output
//Directive - new Html Attribute
//Input
//Output

//Pipe - date, currency, uppercase, json, async