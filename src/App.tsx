import { useAppDispatch } from "@/redux/hook";
import React from "react";
import AggTrade from "./components/AggTrade";
import { connect } from "./redux/slice/websocket-slice";
import KlineChart from "./components/KlineChart";
import OrderBook from "./components/OrderBook";
import Chart from "./components/Chart";
import { Tab, Tabs } from "@nextui-org/react";
import OrderForm from "./components/OrderForm";
import TabList from "./components/TabList";

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
          <OrderBook className="h-full" />
        </div>
        <div className="flex flex-col w-full h-screen">
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
        <div className="!w-80 min-w-80 h-screen flex flex-col">
          <Tabs
            classNames={{
              tabList: "w-full",
            }}
            variant="underlined"
            color={"warning"}
            selectedKey={selected}
            onSelectionChange={(key) => setSelected(key as string)}
          >
            <Tab
              key="TRADING_VIEW"
              title={
                <span className="text-sm font-bold text-[#ffffff]">{`Trading View`}</span>
              }
            />
            <Tab
              key="K_CHART"
              title={
                <span className="text-sm font-bold text-[#ffffff]">{`K Chart`}</span>
              }
            />
          </Tabs>
          <OrderForm className="h-2/5" />
          <AggTrade className="h-3/5" />
        </div>
      </div>
        <TabList/>
    </main>
  );
};

export default App;
