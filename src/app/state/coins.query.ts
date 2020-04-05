import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CoinsStore, CoinsState } from './coins.store';

@Injectable({ providedIn: 'root' })
export class CoinsQuery extends QueryEntity<CoinsState> {

  currentRate$ = this.select(store => store.currentRate);
  coinNames$ = this.select(store => store.ids);

  constructor(protected store: CoinsStore) {
    super(store);
  }

  get ids() {
    return this.getValue().ids;
  }

}
