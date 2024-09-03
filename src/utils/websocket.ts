import { interval, Subscription, timeout } from "./observable";

enum ReadyStateEnum {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

type Option = {
  url: string | URL;
  protocols?: string | string[];
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
  private protocols?: string | string[];
  private queueMessage: QueueMessage[] = [];
  private subscribers: Record<string, Subscriber> = {};
  private interval$?: Subscription;

  constructor(options: Option) {
    this.url = options.url;
    this.protocols = options.protocols;
  }

  public connect() {
    if (
      this.ws?.readyState !== ReadyStateEnum.CLOSED &&
      this.ws?.readyState !== undefined
    )
      return;

    this.ws = new WebSocket(this.url, this.protocols);

    this.ws.addEventListener("open", () => {});

    this.ws.addEventListener("error", (_: Event) => {});

    this.ws.addEventListener("close", () => {
      this.cleanup();
      timeout(2000).subscribe(() => this.connect());
    });

    this.ws.addEventListener("message", (ev: MessageEvent<any>) => {
      Object.values(this.subscribers).forEach((subscriber) =>
        subscriber.callback(ev)
      );
    });

    this.interval$ = interval(400).subscribe(() => {
      if (this.ws?.readyState === ReadyStateEnum.OPEN) {
        const request = this.queueMessage.shift();
        if (request) {
          this.ws?.send(request);
        }
      }
    });
  }

  public addSubscriber(id: string) {
    const subscriber: Subscriber = {
      id,
      params: [],
      callback: () => null,
    };
    this.subscribers[id] = subscriber;

    return {
      send: (data: QueueMessage) => this.send(id, data),
      subscribe: (callback: (ev: MessageEvent<any>) => void) => {
        this.subscribers[id].callback = callback;
      },
      unsubscribe: () => {
        this.unsubscribe(id);
      },
    };
  }

  public unsubscribe(id: string) {
    const allOldParams = this.getAllParamSubscribers();
    this.subscribers[id].params = [];
    const allNewParams = this.getAllParamSubscribers();

    const unsubParams: string[] = [];
    allOldParams.forEach((param) => {
      if (!allNewParams.includes(param)) {
        unsubParams.push(param);
      }
    });
    if (unsubParams.length > 0) {
      this.queueMessage.push(
        JSON.stringify({
          method: "UNSUBSCRIBE",
          params: unsubParams,
          id: 1,
        })
      );
    }
    delete this.subscribers[id];
  }

  private send(id: string, data: QueueMessage) {
    try {
      const request = typeof data === "string" ? JSON.parse(data) : data;

      if (request?.method === "UNSUBSCRIBE") {
        let subscriberParams = this.subscribers[id]?.params;
        if (subscriberParams) {
          request?.params?.forEach((param: string) => {
            subscriberParams = subscriberParams?.filter((c) => c !== param);
          });
          this.subscribers[id].params = subscriberParams;

          const allParams = this.getAllParamSubscribers();
          const unsubParams: string[] = [];
          request?.params?.forEach((param: string) => {
            if (!allParams.includes(param)) {
              unsubParams.push(param);
            }
          });
          if (unsubParams.length > 0) {
            this.queueMessage.push(
              JSON.stringify({ ...request, params: unsubParams })
            );
          }
        }
      } else {
        const subscriberParams = this.subscribers[id]?.params;
        if (subscriberParams) {
          request?.params?.forEach((param: string) => {
            if (!subscriberParams.includes(param)) {
              subscriberParams.push(param);
            }
          });
          this.subscribers[id].params = subscriberParams;
        }
        this.queueMessage.push(data);
      }
    } catch (error) {
      console.error("Failed to send data:", error);
    }
  }

  private getAllParamSubscribers() {
    const params: string[] = [];
    Object.values(this.subscribers).forEach((subscriber) =>
      subscriber?.params?.forEach((param) => {
        if (params.includes(param)) return;
        params.push(param);
      })
    );
    return params;
  }

  private cleanup() {
    this.interval$?.unsubscribe();
  }
}

export default WebsocketService;
