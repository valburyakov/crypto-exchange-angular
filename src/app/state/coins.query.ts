import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CoinsStore, CoinsState } from './coins.store';

@Injectable({ providedIn: 'root' })
export class CoinsQuery extends QueryEntity<CoinsState> {

  constructor(protected store: CoinsStore) {
    super(store);
  }

}
