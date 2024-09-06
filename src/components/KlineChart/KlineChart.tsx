import { useAppSelector } from "@/redux/hook";
import { Chart, dispose, init } from "klinecharts";
import React from "react";

const KlineChart: React.FC = (): JSX.Element => {
  const ws = useAppSelector((state) => state.websocket.ws);

  const chart = React.useRef<Chart>();

  React.useEffect(() => {
    chart.current = init("k-line-chart") as Chart;
    chart.current.setStyles("dark");
    chart.current.createIndicator("EMA", true, { id: "candle_pane" });
    chart.current.createIndicator("VOL");
    chart.current.createIndicator("MACD");

    return () => {
      dispose("k-line-chart");
    };
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        const data = await getBinanceData(
          "BTCUSDT",
          "1m",
          1000,
          new Date().getTime()
        );
        chart.current?.applyNewData(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  React.useEffect(() => {
    const subscriber = ws.addSubscriber("KlineChart");

    subscriber.send(
      JSON.stringify({
        method: "SUBSCRIBE",
        params: ["btcusdt@kline_1m"],
        id: 1,
      })
    );

    subscriber.subscribe((event: MessageEvent<any>) => {
      const message = JSON.parse(event.data);
      if (
        message?.data?.e === "kline" &&
        message?.data?.k?.i === "1m" &&
        message?.data?.k?.s === "BTCUSDT"
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
  }, []);

  const getBinanceData = async (
    symbol: string,
    interval: string,
    limit: number,
    timestamp: number
  ) => {
    const res = await fetch(
      `https://api.binance.com/api/v3/uiKlines?symbol=${symbol}&timeZone=7&interval=${interval}&limit=${limit}&endTime=${timestamp}`
    );
    const data = await res.json();
    return data?.map((item: any) => ({
      timestamp: item[0],
      open: Number(item[1]),
      high: Number(item[2]),
      low: Number(item[3]),
      close: Number(item[4]),
      volume: Number(item[5]),
      turnover: Number(item[7]),
    }));
  };

  return <div id="k-line-chart" style={{ height: "100vh" }} />;
};

export default KlineChart;
