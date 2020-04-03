import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TopCoinsResponse } from '../models';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CurrencyTableItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CryptoApiService {

  constructor(private http: HttpClient) { }

  getCurrenciesInfo(): Observable<CurrencyTableItem[]> {
    return this.http.get<TopCoinsResponse>(`${environment.apiUrl}/data/top/totalvolfull?limit=10&tsym=USD`).pipe(
      map(coins => coins.Data.map(data => ({
        name: data.CoinInfo.Name,
        fullName: data.CoinInfo.FullName,
        pictureUrl: `${environment.imageRootUrl}${data.CoinInfo.ImageUrl}`,
        price: data.RAW.USD.PRICE
      })))
    );
  }

}
