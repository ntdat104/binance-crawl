import mainAxios from "@/api/main-axios";
import { useAppSelector } from "@/redux/hook";
import { formatPrice } from "@/utils/format-price";
import clsx from "clsx";
import dayjs from "dayjs";
import List from "rc-virtual-list";
import React from "react";

type AggTrades = {
  M: boolean;
  T: number;
  a: number;
  f: number;
  l: number;
  m: boolean;
  p: string;
  q: string;
  E: number;
  e: string;
  s: string;
};

interface Props extends React.ComponentPropsWithoutRef<"div"> {}

const AggTrade: React.FC<Props> = (props): JSX.Element => {
  const { className, ...rest } = props;
  const ws = useAppSelector((state) => state.websocket.ws);
  const symbol = useAppSelector((state) => state.websocket.symbol);
  const [aggTrades, setAggTrades] = React.useState<AggTrades[]>([]);

  const aggTradeRef = React.useRef<HTMLDivElement>(null);

  const limit = React.useMemo<number>(() => 80, []);

  React.useEffect(() => {
    (async () => {
      try {
        const data: AggTrades[] = await mainAxios.get(
          `/api/v1/aggTrades?limit=${limit}&symbol=${symbol}`
        );
        setAggTrades(data.reverse());
      } catch (error) {
        console.log(error);
      }
    })();
  }, [symbol, limit]);

  React.useEffect(() => {
    const subscriber = ws.addSubscriber("AggTrade");

    subscriber.send(
      JSON.stringify({
        method: "SUBSCRIBE",
        params: [`${symbol.toLowerCase()}@aggTrade`],
        id: 1,
      })
    );

    subscriber.subscribe((event: MessageEvent<any>) => {
      const message = JSON.parse(event.data);
      if (message?.stream === `${symbol.toLowerCase()}@aggTrade`) {
        const data = message?.data;
        setAggTrades((aggSnap) => {
          const newAggTrades = [...aggSnap];
          newAggTrades.pop();
          newAggTrades.unshift(data);
          return newAggTrades;
        });
      }
    });

    return () => {
      subscriber.unsubscribe();
    };
  }, [symbol]);

  return (
    <div
      ref={aggTradeRef}
      className={clsx("border border-solid border-[#2B3139]", className)}
      {...rest}
    >
      <div className="px-4 h-[44px] flex items-center border-b border-solid border-[#2B3139]">
        <span className="text-sm text-[#eaecef]">{`Giao dịch`}</span>
      </div>
      <div className="w-full pb-3">
        <div className="flex items-center px-4 pt-[8px] pb-[4px]">
          <span className="text-xs text-[#848e9c] w-[30%] text-left">{`Giá(USDT)`}</span>
          <span className="text-xs text-[#848e9c] w-[40%] text-right">{`Số lượng(BTC)`}</span>
          <span className="text-xs text-[#848e9c] w-[30%] text-right">{`Thời gian`}</span>
        </div>
        <List
          data={aggTrades}
          height={
            aggTradeRef.current?.clientHeight
              ? aggTradeRef.current?.clientHeight - 90
              : 200
          }
          itemHeight={30}
          itemKey="AggSnap"
          styles={{
            verticalScrollBar: {
              width: 6,
            },
            verticalScrollBarThumb: {
              backgroundColor: "#848e9c",
            },
          }}
        >
          {(item) => (
            <div className="flex items-center h-[18px] px-4">
              <span
                className="text-xs w-[30%] text-left"
                style={{ color: !item?.m ? "#2ebd85" : "#f6465d" }}
              >
                {formatPrice(item?.p)}
              </span>
              <span className="text-xs text-[#eaecef] w-[40%] text-right">
                {formatPrice(Math.abs(Number(item?.q)), 5)}
              </span>
              <span className="text-xs text-[#eaecef] w-[30%] text-right">
                {dayjs(item?.T).format("HH:mm:ss")}
              </span>
            </div>
          )}
        </List>
      </div>
    </div>
  );
};

export default AggTrade;
