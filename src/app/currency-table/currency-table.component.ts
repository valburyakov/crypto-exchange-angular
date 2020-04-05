import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CoinItem } from '../models';
import { CoinFlags } from '../models/web-scoket.types';


@Component({
  selector: 'app-currency-table',
  templateUrl: './currency-table.component.html',
  styleUrls: ['./currency-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyTableComponent {

  @Input() coins: CoinItem[];

  @Output() selected = new EventEmitter<string>();

  displayedColumns = ['image', 'name', 'price'];
  coinFlags = CoinFlags;

  selectRow(row: CoinItem) {
    this.selected.emit(row.name);
  }
}
