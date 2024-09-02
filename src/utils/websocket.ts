import { interval, timeout } from "./observable";

enum ReadyStateEnum {
  "CONNECTING" = 0,
  "OPEN" = 1,
  "CLOSING" = 2,
  "CLOSED" = 3,
}

type Option = {
  url: string | URL;
  protocols?: string | string[] | undefined;
};

type Subscriber = {
  id: string;
  params: string[];
  callback: (ev: MessageEvent<any>) => void;
};

type QueueMessage = string | ArrayBufferLike | Blob | ArrayBufferView;

class WebsocketService {
  private ws?: WebSocket;
  private url: string | URL;
  private protocols?: string | string[] | undefined;
  private queueMessage: QueueMessage[] = [];
  private params: string[] = [];
  private subscribers: Record<string, Subscriber> = {};

  constructor(options: Option) {
    this.url = options.url;
    this.protocols = options.protocols;
  }

  public connect() {
    if (!this.ws || this.ws.readyState === ReadyStateEnum.CLOSED) {
      this.ws = new WebSocket(this.url, this.protocols);

      this.ws.addEventListener("open", async (_ev: Event) => {
        // console.log("Websocket is connected");
        if (this.params.length) {
          this.ws?.send(
            JSON.stringify({
              method: "SUBSCRIBE",
              params: this.params,
              id: 1,
            })
          );
        }
      });

      this.ws.addEventListener("error", (_ev: Event) => {
        // console.log("Websocket is error", ev);
      });

      this.ws.addEventListener("close", (_ev: CloseEvent) => {
        // console.log("Websocket is closed");
        interval$.unsubscribe();
        timeout(2000).subscribe(() => {
          this.connect();
        });
      });

      this.ws.addEventListener("message", (ev: MessageEvent<any>) => {
        for (const id in this.subscribers) {
          this.subscribers[id].callback(ev);
        }
      });

      const interval$ = interval(1000).subscribe(() => {
        const request = this.queueMessage.shift();
        if (request) {
          this.ws?.send(request);
        }
      });
    }
  }

  public send(data: QueueMessage) {
    try {
      const request = JSON.parse(data as string);
      const params: string[] = [];
      if (request?.params) {
        request?.params?.forEach((param: string) => {
          if (!this.params.includes(param)) {
            this.params.push(param);
            params.push(param);
          }
        });
      }
      request["params"] = params;
      if (request?.params?.length > 0) {
        this.queueMessage.push(JSON.stringify(request));
      }
    } catch (error) {
      console.log(error);
    }
  }

  public addSubscriber({ id, params }: { id: string; params: string[] }) {
    this.subscribers[id] = {
      id,
      params,
      callback: () => null,
    };
    return {
      send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) =>
        this.send(data),
      subscribe: (callback: (ev: MessageEvent<any>) => void) => {
        this.subscribers[id] = {
          ...this.subscribers[id],
          callback,
        };
      },
    };
  }

  public unsubscribe(id: string) {
    delete this.subscribers[id];
  }
}

export default WebsocketService;
