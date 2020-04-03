import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CryptoApiService } from '../services/crypto-api.service';
import { Observable } from 'rxjs';
import { CurrencyTableItem } from '../models';

@Component({
  selector: 'app-currency-table',
  templateUrl: './currency-table.component.html',
  styleUrls: ['./currency-table.component.scss']
})
export class CurrencyTableComponent implements AfterViewInit, OnInit {

  displayedColumns = ['image', 'name', 'price'];

  items$: Observable<CurrencyTableItem[]>;

  constructor(private cryptoService: CryptoApiService) {}

  ngOnInit() {
    this.items$ = this.cryptoService.getCurrenciesInfo();
  }

  ngAfterViewInit() {
  }
}
