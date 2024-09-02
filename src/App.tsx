import OrderBook from "@/components/OrderBook";
import React from "react";

const App: React.FC = (): JSX.Element => {
  return (
    <main className="dark p-10">
      <OrderBook className="!w-80" />
    </main>
  );
};

export default App;
