export enum WsMessageTypes {
  CCCAGG = '5',
  HEARTBEAT = '999',
  SUBSCRIBECOMPLETE = 16,
  UNSUBSCRIBECOMPLETE = 18
}

export enum CoinFlags {
  UP = '1',
  DOWN = '2',
  UNCHANGED = '4'
}

export type WsMessage = string;
