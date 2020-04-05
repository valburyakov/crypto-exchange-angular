import { Injectable, OnDestroy } from '@angular/core';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { interval, Observable, Observer, Subject, SubscriptionLike } from 'rxjs';
import { distinctUntilChanged, filter, map, share, takeWhile } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { WsMessage, WsMessageTypes } from '../models/web-scoket.types';


@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {

  private config: WebSocketSubjectConfig<WsMessage>;

  private websocketSub: SubscriptionLike;
  private statusSub: SubscriptionLike;

  private reconnection$: Observable<number>;
  private websocket$: WebSocketSubject<WsMessage>;
  private wsMessages$: Subject<WsMessage>;
  private connection$: Observer<boolean>;

  private reconnectInterval: number;
  private reconnectAttempts: number;
  private isConnected: boolean;


  public status: Observable<boolean>;

  constructor() {
    this.wsMessages$ = new Subject<WsMessage>();

    this.reconnectInterval = 5000; // pause between connections
    this.reconnectAttempts = 10; // number of connection attempts

    this.config = {
      url: `${environment.wsUrl}?format=streamer`,
      closeObserver: {
        next: (event: CloseEvent) => {
          this.websocket$ = null;
          this.connection$.next(false);
        }
      },
      openObserver: {
        next: (event: Event) => {
          console.log('WebSocket connected!');
          this.connection$.next(true);
        }
      },
      deserializer: message => message.data
    };

    // connection status
    this.status = new Observable<boolean>((observer) => {
      this.connection$ = observer;
    }).pipe(share(), distinctUntilChanged());

    // run reconnect if not connection
    this.statusSub = this.status
      .subscribe((isConnected) => {
        this.isConnected = isConnected;

        if (!this.reconnection$ && typeof(isConnected) === 'boolean' && !isConnected) {
          this.reconnect();
        }
      });

    this.websocketSub = this.wsMessages$.subscribe(
      null, (error: ErrorEvent) => console.error('WebSocket error!', error)
    );

    this.connect();
  }

  ngOnDestroy() {
    this.websocketSub.unsubscribe();
    this.statusSub.unsubscribe();
  }

  disconnect() {
    this.websocket$.unsubscribe();
  }

  /*
  * connect to WebSocked
  * */
  private connect(): void {
    this.websocket$ = new WebSocketSubject(this.config);

    this.websocket$.subscribe(
      (message) => this.wsMessages$.next(message),
      (error: Event) => {
        if (!this.websocket$) {
          // run reconnect if errors
          this.reconnect();
        }
      });
  }


  /*
  * reconnect if not connecting or errors
  * */
  private reconnect(): void {
    this.reconnection$ = interval(this.reconnectInterval)
      .pipe(takeWhile((v, index) => index < this.reconnectAttempts && !this.websocket$));

    this.reconnection$.subscribe(
      () => this.connect(),
      null,
      () => {
        // Subject complete if reconnect attempts ending
        this.reconnection$ = null;

        if (!this.websocket$) {
          this.wsMessages$.complete();
          this.connection$.complete();
        }
      });
  }


  /*
  * on message event
  * */
  public on<T>(event: WsMessageTypes, mapFn: ((message: WsMessage) => T)): Observable<T> {
    return this.wsMessages$.pipe(
      filter(data => data.split('~')[0] === event),
      map(data => mapFn(data))
    );
  }


  /*
  * on message to server
  * */
  public send(data: any = {}): void {
    if (this.isConnected) {
      this.websocket$.next(data);
    } else {
      console.error('Send error!');
    }
  }
}
