import { useAppDispatch } from "@/redux/hook";
import React from "react";
import AggSnap from "./components/AggSnap";
import { connect } from "./redux/slice/websocket-slice";

const App: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(connect());
  }, []);

  return (
    <main className="dark">
      <div className="flex">
        {/* <OrderBook className="!w-80 min-w-80 h-screen" /> */}
        {/* <Chart /> */}
        <AggSnap />
      </div>
    </main>
  );
};

export default App;
