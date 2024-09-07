import { useAppDispatch } from "@/redux/hook";
import React from "react";
import AggSnap from "./components/AggSnap";
import { connect } from "./redux/slice/websocket-slice";
import KlineChart from "./components/KlineChart";
import OrderBook from "./components/OrderBook";
import Chart from "./components/Chart";
import { Tab, Tabs } from "@nextui-org/react";

const App: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = React.useState("TRADING_VIEW");

  React.useEffect(() => {
    dispatch(connect());
  }, []);

  return (
    <main className="dark">
      <div className="flex">
        <div className="!w-80 min-w-80 h-screen flex flex-col">
          <OrderBook className="h-3/4" />
          <AggSnap className="h-1/4" />
        </div>
        <div className="flex flex-col w-full h-screen">
          <Tabs
            variant="bordered"
            color={"warning"}
            selectedKey={selected}
            onSelectionChange={(key) => setSelected(key as string)}
          >
            <Tab key="TRADING_VIEW" title="Trading View" />
            <Tab key="K_CHART" title="K Chart" />
          </Tabs>
          <div className="w-full h-full relative">
            <Chart
              className="absolute"
              style={{
                visibility: selected === "TRADING_VIEW" ? "visible" : "hidden",
              }}
            />
            <KlineChart
              className="absolute"
              style={{
                visibility: selected === "K_CHART" ? "visible" : "hidden",
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default App;
