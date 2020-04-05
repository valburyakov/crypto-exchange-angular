import { Component, OnInit } from '@angular/core';
import { CoinsQuery } from './state/coins.query';
import { CoinsService } from './state/coins.service';
import { WebSocketService } from './services/web-socket.service';
import { Observable } from 'rxjs';
import { filter, switchMapTo } from 'rxjs/operators';
import { CoinItem } from './models';
import { CoinFlags, WsMessageTypes } from './models/web-scoket.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'crypto-exchange';

  items$: Observable<CoinItem[]>;
  loading$: Observable<boolean>;

  subscribed = false;

  constructor(private coinsQuery: CoinsQuery,
              private coinsService: CoinsService,
              private wsService: WebSocketService) {}

  ngOnInit() {
    this.coinsService.get().pipe(
      switchMapTo(this.wsService.status),
      filter(Boolean)
    )
      .subscribe(_ => this.addSub());

    this.items$ = this.coinsQuery.selectAll();
    this.loading$ = this.coinsQuery.selectLoading();

    const eventMapper = (message: string): Partial<CoinItem> => {
      const parts = message.split('~');
      const flags = parts[4] as CoinFlags;
      return {
        name: parts[2],
        flag: flags,
        ...flags !== CoinFlags.UNCHANGED ? { price: parseFloat(parts[5]) } : null
      };
    };

    this.wsService.on(WsMessageTypes.CCCAGG, eventMapper)
      .subscribe(updatedCoin => this.coinsService.update(updatedCoin.name, updatedCoin));

    this.wsService.on(WsMessageTypes.LOADCOMPLETE, m => m)
      .subscribe(_ => this.subscribed = true);

    this.wsService.on(WsMessageTypes.UNSUBSCRIBEALLCOMPLETE, m => m)
      .subscribe(_ => this.subscribed = false);
  }

  addSub() {
    this.wsService.send({
      action: 'SubAdd',
      subs: this.coinsQuery.getValue().ids.map(id => `5~CCCAGG~${id}~USD`)
    });
  }

  unsubscribe() {
    this.wsService.send({
      action: 'SubRemove',
      subs: this.coinsQuery.getValue().ids.map(id => `5~CCCAGG~${id}~USD`)
    });
  }
}
