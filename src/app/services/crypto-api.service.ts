import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TopCoinsResponse } from '../models';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CoinItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CryptoApiService {

  constructor(private http: HttpClient) { }

  getCurrenciesInfo(): Observable<CoinItem[]> {
    return this.http.get<TopCoinsResponse>(`${environment.apiUrl}/data/top/totalvolfull?limit=10&tsym=USD`).pipe(
      map(coins => coins.Data.map(data => ({
        name: data.CoinInfo.Name,
        fullName: data.CoinInfo.FullName,
        pictureUrl: `${environment.imageRootUrl}${data.CoinInfo.ImageUrl}`,
        price: data.RAW.USD.PRICE
      })))
    );
  }

  getCurrencyPrice(from: string, to: string): Observable<number> {
    return this.http.get<{[key: string]: number}>(`${environment.apiUrl}/data/price?fsym=${from}&tsyms=${to}`).pipe(
      map(res => res[to])
    );
  }

}
