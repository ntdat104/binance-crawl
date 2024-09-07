import { useAppSelector } from "@/redux/hook";
import clsx from "clsx";
import { Chart, dispose, init, Nullable } from "klinecharts";
import React from "react";

interface Props extends React.ComponentPropsWithoutRef<"div"> {}

const KlineChart: React.FC<Props> = (props): JSX.Element => {
  const { className, ...rest } = props;
  const symbol = useAppSelector((state) => state.websocket.symbol);
  const interval = useAppSelector((state) => state.websocket.interval);
  const ws = useAppSelector((state) => state.websocket.ws);
  const chartRef = React.useRef<HTMLDivElement>(null);
  const chart = React.useRef<Chart>();
  const hasMore = React.useRef<boolean>(true);

  React.useEffect(() => {
    chart.current = init(chartRef.current as any) as Chart;
    chart.current.setStyles("dark");
    chart.current.createIndicator("EMA", true, { id: "candle_pane" });
    chart.current.createIndicator("VOL");
    chart.current.createIndicator("MACD");
    return () => {
      dispose(chartRef.current as any);
    };
  }, []);

  React.useEffect(() => {
    chart.current?.clearData();
    (async () => {
      try {
        const data = await getBinanceData(
          symbol,
          interval,
          1000,
          new Date().getTime()
        );
        chart.current?.applyNewData(data);
        hasMore.current = true;
      } catch (error) {
        console.log(error);
      }
    })();
    chart.current?.loadMore((timestamp: Nullable<number>) => {
      if (!timestamp) return;
      if (!hasMore.current) return;
      (async () => {
        try {
          const klineData = await getBinanceData(
            symbol,
            interval,
            1000,
            timestamp
          );
          chart.current?.applyMoreData(klineData, true);
          if (klineData?.length < 1000) {
            hasMore.current = false;
          }
        } catch (error) {
          console.log(error);
        }
      })();
    });
  }, [symbol, interval]);

  React.useEffect(() => {
    const subscriber = ws.addSubscriber("KlineChart");

    subscriber.send(
      JSON.stringify({
        method: "SUBSCRIBE",
        params: [`${symbol.toLowerCase()}@kline_${interval}`],
        id: 1,
      })
    );

    subscriber.subscribe((event: MessageEvent<any>) => {
      const message = JSON.parse(event.data);
      if (
        message?.data?.e === "kline" &&
        message?.data?.k?.i === interval &&
        message?.data?.k?.s === symbol
      ) {
        const kline = message?.data?.k;
        const bar = {
          timestamp: kline.t,
          open: parseFloat(kline.o),
          high: parseFloat(kline.h),
          low: parseFloat(kline.l),
          close: parseFloat(kline.c),
          volume: parseFloat(kline.v),
        };
        chart.current?.updateData(bar);
      }
    });

    return () => {
      subscriber.unsubscribe();
    };
  }, [symbol]);

  const getBinanceData = async (
    symbol: string,
    interval: string,
    limit: number,
    timestamp: number
  ) => {
    const res = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}&endTime=${timestamp}`
    );
    const data = await res.json();
    const result = data?.map((item: any) => ({
      timestamp: item[0],
      open: Number(item[1]),
      high: Number(item[2]),
      low: Number(item[3]),
      close: Number(item[4]),
      volume: Number(item[5]),
      turnover: Number(item[7]),
    }));
    return result;
  };

  return (
    <div
      ref={chartRef}
      className={clsx("w-full h-full bg-[#1b1b1f]", className)}
      {...rest}
    />
  );
};

export default KlineChart;
