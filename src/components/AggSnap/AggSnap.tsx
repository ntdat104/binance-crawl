import { useAppSelector } from "@/redux/hook";
import { formatPrice } from "@/utils/format-price";
import dayjs from "dayjs";
import List from "rc-virtual-list";
import React from "react";

type AggTrades = {
  e: string;
  s: string;
  p: string;
  cq: string;
  T: number;
};

const AggSnap: React.FC = (): JSX.Element => {
  const wsf = useAppSelector((state) => state.websocket.wsf);
  const [symbol] = React.useState("BTCUSDT");
  const [aggSnap, setAggSnap] = React.useState<AggTrades[]>([]);

  React.useEffect(() => {
    const subscriber = wsf.addSubscriber("AggSnap");

    subscriber.send(
      JSON.stringify({
        method: "SUBSCRIBE",
        params: [`${symbol.toLowerCase()}@aggSnap`],
        id: 1,
      })
    );

    subscriber.subscribe((event: MessageEvent<any>) => {
      const message = JSON.parse(event.data);
      if (message?.stream === `${symbol.toLowerCase()}@aggSnap`) {
        const data = message?.data;
        setAggSnap((aggSnap) => [data, ...aggSnap]);
      }
    });
  }, []);

  return (
    <div className="border border-solid border-[#2B3139]">
      <div className="px-4 h-[44px] flex items-center border-b border-solid border-[#2B3139]">
        <span className="text-sm text-[#eaecef]">{`Giao dịch`}</span>
      </div>
      <div className="w-[300px] pb-3">
        <div className="flex items-center px-4 pt-[8px] pb-[4px]">
          <span className="text-xs text-[#848e9c] w-[30%] text-left">{`Giá(USDT)`}</span>
          <span className="text-xs text-[#848e9c] w-[40%] text-right">{`Số lượng(BTC)`}</span>
          <span className="text-xs text-[#848e9c] w-[30%] text-right">{`Thời gian`}</span>
        </div>
        <List
          data={aggSnap}
          height={200}
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
                style={{ color: Number(item?.cq) > 0 ? "#2ebd85" : "#f6465d" }}
              >
                {formatPrice(item?.p)}
              </span>
              <span className="text-xs text-[#eaecef] w-[40%] text-right">
                {formatPrice(Math.abs(Number(item?.cq)), 3)}
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

export default AggSnap;
