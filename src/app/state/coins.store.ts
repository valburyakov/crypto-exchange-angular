import { Injectable } from '@angular/core';
import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { CoinItem } from '../models';

export interface CoinsState extends EntityState<CoinItem, string>, ActiveState {
  currentRate: number
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'coins', idKey: 'name' })
export class CoinsStore extends EntityStore<CoinsState> {

  constructor() {
    super({currentRate: 1});
  }

}

