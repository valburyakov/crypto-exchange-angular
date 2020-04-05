import { Component, OnInit } from '@angular/core';
import { CryptoApiService } from '../services/crypto-api.service';
import { Observable } from 'rxjs';
import { CurrencyTableItem } from '../models';
import { WebSocketService} from '../services/web-socket.service';
import { WsMessageTypes } from '../models/web-scoket.types';

@Component({
  selector: 'app-currency-table',
  templateUrl: './currency-table.component.html',
  styleUrls: ['./currency-table.component.scss']
})
export class CurrencyTableComponent implements OnInit {

  displayedColumns = ['image', 'name', 'price'];

  items$: Observable<CurrencyTableItem[]>;

  constructor(private cryptoService: CryptoApiService, private wsService: WebSocketService) {}

  ngOnInit() {
    this.items$ = this.cryptoService.getCurrenciesInfo();

    const eventMapper = (message: string) => {
      const parts = message.split('~');
      return {
        name: parts[2],
        price: parseFloat(parts[5]),
        flag: parts[4]
      };
    };

    this.wsService.on(WsMessageTypes.CCCAGG, eventMapper)
      .subscribe(res => console.log(res));
  }

  addSub() {
    this.wsService.send({
      action: 'SubAdd',
      subs: ['5~CCCAGG~BTC~USD']
    });
  }

  unsubscribe() {
    this.wsService.send({
      action: 'SubRemove',
      subs: ['5~CCCAGG~BTC~USD']
    });
  }

}
