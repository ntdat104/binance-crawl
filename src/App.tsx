import OrderBook from "@/components/OrderBook";
import React from "react";
import { useAppSelector } from "@/redux/hook";
import Chart from "@/components/Chart";

const App: React.FC = (): JSX.Element => {
  const ws = useAppSelector((state) => state.websocket.ws);

  React.useEffect(() => {
    ws.connect();
  }, []);

  return (
    <main className="dark">
      <div className="flex">
        <OrderBook className="!w-80 min-w-80 h-screen" />
        <Chart />
      </div>
    </main>
  );
};

export default App;
