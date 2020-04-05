import { Injectable } from '@angular/core';
import { CoinsStore } from './coins.store';
import { tap } from 'rxjs/operators';
import { CryptoApiService } from '../services/crypto-api.service';
import { CoinItem } from '../models';

@Injectable({ providedIn: 'root' })
export class CoinsService {

  constructor(private coinsStore: CoinsStore,
              private cryptoService: CryptoApiService) {
  }

  get() {
    return this.cryptoService.getCurrenciesInfo().pipe(tap(entities => {
      this.coinsStore.set(entities);
    }));
  }

  update(id: string, coin: Partial<CoinItem>) {
    this.coinsStore.update(id, coin);
  }

  remove(id: string) {
    this.coinsStore.remove(id);
  }
}
