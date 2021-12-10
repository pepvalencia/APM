import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, tap ,map } from "rxjs/operators";
import { IProduct } from "./product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  //private productUrl = 'api/products/products.json';
  private productUrl = 'http://localhost:8080/app/products/all';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.productUrl).pipe(
      tap(data => console.log('All', JSON.stringify(data))),
      catchError(this.handleErrror)
    );
  }

  // Get one product
// Since we are working with a json file, we can only retrieve all products
// So retrieve all products and then find the one we want using 'map'
  getProduct(id: number): Observable < IProduct | undefined > {
  return this.getProducts()
    .pipe(
      map((products: IProduct[]) => products.find(p => p.id === id))
    );
  }

    handleErrror(err: HttpErrorResponse) {
      let errorMessage = '';
      if (err.error instanceof ErrorEvent) {
        errorMessage = `error occuerred: ${err.error.message}`
      } else {
        errorMessage = `server returned code: ${err.status}, error message is ${err.message}`;
      }
      console.error(errorMessage);
      return throwError(errorMessage);
    }
}
