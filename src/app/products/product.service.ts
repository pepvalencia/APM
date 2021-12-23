import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError, tap ,map } from "rxjs/operators";
import { IProduct } from "./product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  //private productUrl = 'api/products/products.json';
  private productsAllUrl = 'http://localhost:8080/app/products/all';
  private productsAddUrl = 'http://localhost:8080/app/products/addComplete';
  private productsBaseUrl = 'http://localhost:8080/app/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.productsAllUrl).pipe(
      tap(data => console.log('All', JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  // Get one product
// Since we are working with a json file, we can only retrieve all products
// So retrieve all products and then find the one we want using 'map'
  /*getProduct(id: number): Observable < IProduct | undefined > {
  return this.getProducts()
    .pipe(
      map((products: IProduct[]) => products.find(p => p.id === id))
    );
  }*/

    handleError(err: HttpErrorResponse) {
      let errorMessage = '';
      if (err.error instanceof ErrorEvent) {
        errorMessage = `error occuerred: ${err.error.message}`
      } else {
        errorMessage = `server returned code: ${err.status}, error message is ${err.message}`;
      }
      console.error(errorMessage);
      return throwError(errorMessage);
    }

  getProduct(id: number): Observable<IProduct> {
    if (id === 0) {
      return of(this.initializeProduct());
    }
    const url = `${this.productsBaseUrl}/${id}`;
    return this.http.get<IProduct>(url)
      .pipe(
        tap(data => console.log('getProduct: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createProduct(product: IProduct): Observable<IProduct> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    product.id = 0;
    return this.http.post<IProduct>(this.productsAddUrl, product, { headers })
      .pipe(
        tap(data => console.log('createProduct: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteProduct(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.productsBaseUrl}/${id}`;
    return this.http.delete<IProduct>(url, { headers })
      .pipe(
        tap(data => console.log('deleteProduct: ' + id)),
        catchError(this.handleError)
      );
  }

  updateProduct(product: IProduct): Observable<IProduct> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.productsBaseUrl}/${product.id}`;
    return this.http.put<IProduct>(url, product, { headers })
      .pipe(
        tap(() => console.log('updateProduct: ' + product.id)),
        // Return the product on an update
        map(() => product),
        catchError(this.handleError)
      );
  }

  /*private handleError(err): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }*/

  private initializeProduct(): IProduct {
    // Return an initialized object
    return {
      id: 0,
      productName: "",
      productCode: "",
      releaseDate: "",
      price: 0,
      description: "",
      starRating: 0,
      imageUrl: ""
    };
  }
}
