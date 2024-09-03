import mainAxios from "@/api/main-axios";
import ArrowDownIcon from "@/components/icons/ArrowDownIcon";
import ArrowDownRedIcon from "@/components/icons/ArrowDownRedIcon";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";
import ArrowUpGreenIcon from "@/components/icons/ArrowUpGreenIcon";
import BuyOrderIcon from "@/components/icons/BuyOrderIcon";
import BuySellOrderIcon from "@/components/icons/BuySellOrderIcon";
import SellOrderIcon from "@/components/icons/SellOrderIcon";
import ThreeDotIcon from "@/components/icons/ThreeDotIcon";
import { useAppSelector } from "@/redux/hook";
import { setDocumentTitle } from "@/utils/document";
import { formatPrice } from "@/utils/format-price";
import {
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Switch,
  Tooltip,
} from "@nextui-org/react";
import clsx from "clsx";
import React from "react";
import Comparation from "./Comparation";
import OrderBookDetail from "./OrderBookDetail";

type SymbolInfo = {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  lastPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
  isDown: boolean;
};

type Depth = {
  asks: Record<string, string>;
  bids: Record<string, string>;
};

interface Props extends React.ComponentPropsWithoutRef<"div"> {}

const OrderBook: React.FC<Props> = (props): JSX.Element => {
  const { className, ...rest } = props;

  const ws = useAppSelector((state) => state.websocket.ws);
  const symbol = useAppSelector((state) => state.websocket.symbol);

  const [size] = React.useState(100);

  const [tabOrder, setTabOrder] = React.useState(1);
  const [tick, setTick] = React.useState(0.01);
  const [depth, setDepth] = React.useState<Depth>({
    asks: {},
    bids: {},
  });
  const [symbolInfo, setSymbolInfo] = React.useState<SymbolInfo>();

  React.useEffect(() => {
    (async () => {
      try {
        const data = await mainAxios.get(
          `/api/v3/ticker/tradingDay?symbols=["${symbol}"]`
        );
        setSymbolInfo(data[0]);
        setDocumentTitle(
          `${formatPrice(data[0].lastPrice, 2)} | ${symbol} | Binance Spot`
        );
      } catch (error) {
        console.log(error);
      }
    })();
  }, [symbol]);

  React.useEffect(() => {
    (async () => {
      try {
        const data: {
          asks: string[][];
          bids: string[][];
        } = await mainAxios.get(`/api/v1/depth?symbol=${symbol}&limit=${1000}`);
        const asks = {};
        const bids = {};
        data.asks.forEach((item) => {
          asks[item[0]] = item[1];
        });
        data.bids.forEach((item) => {
          bids[item[0]] = item[1];
        });
        setDepth({ asks, bids });
      } catch (error) {
        console.log(error);
      }
    })();
  }, [symbol]);

  React.useEffect(() => {
    const subscriber = ws.addSubscriber("OrderBook");

    subscriber.send(
      JSON.stringify({
        method: "SUBSCRIBE",
        params: [
          `${symbol.toLowerCase()}@kline_1m`,
          `${symbol.toLowerCase()}@depth`,
        ],
        id: 1,
      })
    );

    subscriber.subscribe((event: MessageEvent<any>) => {
      const message = JSON.parse(event.data);
      if (message?.data?.e === "depthUpdate" && message?.data?.s === symbol) {
        setDepth((depth) => {
          const asks = { ...depth.asks };
          const bids = { ...depth.bids };
          message?.data?.a?.forEach((item) => {
            asks[item[0]] = item[1];
          });
          message?.data?.b?.forEach((item) => {
            bids[item[0]] = item[1];
          });
          return { asks, bids };
        });
      }

      if (
        message?.data?.e === "kline" &&
        message?.data?.k?.i === "1m" &&
        message?.data?.k?.s === symbol
      ) {
        const kline = message?.data?.k;
        setDocumentTitle(
          `${formatPrice(kline.c, 2)} | ${symbol} | Binance Spot`
        );
        setSymbolInfo((symbolInfo) => {
          if (!symbolInfo) return;
          return {
            ...symbolInfo,
            lastPrice: kline.c,
            isDown: Number(kline.c) < Number(symbolInfo.lastPrice),
          };
        });
      }
    });

    return () => {
      subscriber.unsubscribe();
    };
  }, [symbol]);

  const asks = React.useMemo(() => {
    const asksKey = Object.keys(depth.asks);
    asksKey.sort((a, b) => Number(a) - Number(b));
    return asksKey
      .map((key) => [key, depth.asks[key]])
      .filter((item) => Number(item[1]))
      .slice(0, size);
  }, [depth.asks]);

  const bids = React.useMemo(() => {
    const bidsKey = Object.keys(depth.bids);
    bidsKey.sort((a, b) => Number(b) - Number(a));
    return bidsKey
      .map((key) => [key, depth.bids[key]])
      .filter((item) => Number(item[1]))
      .slice(0, size);
  }, [depth.bids]);

  const comparePercent = React.useMemo(() => {
    const totalBids = bids.reduce(
      (acc, item) => acc + Number(item[0]) * Number(item[1]),
      0
    );
    const totalAsks = asks.reduce(
      (acc, item) => acc + Number(item[0]) * Number(item[1]),
      0
    );
    const buy = ((totalBids / (totalAsks + totalBids)) * 100).toFixed(2);
    const sell = (100 - Number(buy)).toFixed(2);
    return { buy, sell };
  }, [asks, bids]);

  return (
    <div
      className={clsx(
        "w-full border border-solid border-[#2B3139] select-none",
        className
      )}
      {...rest}
    >
      <div className="flex items-center justify-between px-4 py-[9px] border-b border-solid border-b-[#2B3139]">
        <span className="text-sm text-[#eaecef]">{`Sổ lệnh`}</span>
        <Popover
          placement={`bottom-end`}
          classNames={{
            content: [
              "py-2 px-0 rounded-[8px] shadow-[0_0_10px_rgba(0,0,0,0.2)] bg-[#1E2329]",
            ],
          }}
        >
          <PopoverTrigger>
            <div className="size-4">
              <ThreeDotIcon className="fill-[#848E9C] hover:fill-white cursor-pointer" />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div className="text-left">
              <div className="py-[6px] px-[10px]">
                <span className="text-xs text-[#848E9C]">{`Hiển thị sổ lệnh`}</span>
              </div>
              <div className="py-2 px-[10px] hover:bg-[#2b3139]">
                <Checkbox defaultSelected color="warning" size="sm" radius="sm">
                  <span className="text-xs text-[#EAECEF]">{`Hiển thị Trung bình và Tổng`}</span>
                </Checkbox>
              </div>
              <div className="py-2 px-[10px] hover:bg-[#2b3139]">
                <Checkbox defaultSelected color="warning" size="sm" radius="sm">
                  <span className="text-xs text-[#EAECEF]">{`Hiển thị tỉ lệ mua/bán`}</span>
                </Checkbox>
              </div>
              <div className="py-[6px] px-[10px]">
                <span className="text-xs text-[#848E9C]">{`Hình ảnh độ sâu sổ lệnh`}</span>
              </div>
              <RadioGroup>
                <div className="py-2 px-[10px] hover:bg-[#2b3139]">
                  <Radio value="quantity" color="warning">
                    <span className="text-xs text-[#EAECEF]">{`Số lượng`}</span>
                  </Radio>
                </div>
                <div className="py-2 px-[10px] hover:bg-[#2b3139]">
                  <Radio value="accumulate" color="warning">
                    <span className="text-xs text-[#EAECEF]">{`Tích lũy`}</span>
                  </Radio>
                </div>
              </RadioGroup>
              <div className="py-2 px-[10px] flex items-center justify-between">
                <span className="text-sm text-[#EAECEF]">{`Ảnh động`}</span>
                <Switch defaultSelected color="warning" size="sm" />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* OrderBook Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex gap-3">
          {[
            {
              id: 1,
              content: "Sổ lệnh",
              icon: <BuySellOrderIcon className="cursor-pointer" />,
            },
            {
              id: 2,
              content: "Lệnh mua",
              icon: <BuyOrderIcon className="cursor-pointer" />,
            },
            {
              id: 3,
              content: "Lênh bán",
              icon: <SellOrderIcon className="cursor-pointer" />,
            },
          ].map((item, index) => (
            <Tooltip
              showArrow={true}
              placement="bottom"
              content={item.content}
              delay={400}
              closeDelay={0}
              key={index}
            >
              <div
                className={clsx({
                  "opacity-50": tabOrder !== item.id,
                })}
                onClick={() => setTabOrder(item.id)}
              >
                {item.icon}
              </div>
            </Tooltip>
          ))}
        </div>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <div className="flex items-center cursor-pointer">
              <span className="text-[#eaecef] text-xs">{tick}</span>
              <div className="size-4">
                <ArrowDownIcon className="fill-[#848E9C] hover:fill-white cursor-pointer" />
              </div>
            </div>
          </DropdownTrigger>
          <DropdownMenu
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={[tick]}
            onAction={(key) => setTick(key as number)}
          >
            {[0.01, 0.1, 1, 10, 50, 100].map((item) => (
              <DropdownItem key={item}>{`${item}`}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* OrderBook tb-header */}
      <div className="flex items-center px-4">
        <span className="text-[#848e9c] text-xs w-1/3 text-left">{`Giá(USDT)`}</span>
        <span className="text-[#848e9c] text-xs w-1/3 text-right">{`Số lượng(BTC)`}</span>
        <span className="text-[#848e9c] text-xs w-1/3 text-right">{`Tổng`}</span>
      </div>

      {/* OrderBook sell-content */}
      {(tabOrder === 1 || tabOrder === 3) && (
        <OrderBookDetail
          tabOrder={tabOrder}
          display="asks"
          asks={asks}
          bids={bids}
        />
      )}

      {/* OrderBook ticker */}
      <div
        className={clsx("flex items-center px-4", {
          "pt-2": tabOrder === 2,
          "pb-2": tabOrder === 3,
        })}
      >
        <span
          className={clsx("text-xl", {
            "text-[#2ebd85]": symbolInfo && !symbolInfo?.isDown,
            "text-[#f6465d]": symbolInfo && symbolInfo?.isDown,
          })}
        >
          {symbolInfo && formatPrice(symbolInfo?.lastPrice)}
        </span>
        <div className="size-4">
          {symbolInfo && !symbolInfo?.isDown && (
            <ArrowUpGreenIcon className="fill-[#2ebd85]" />
          )}
          {symbolInfo && symbolInfo?.isDown && (
            <ArrowDownRedIcon className="fill-[#f6465d]" />
          )}
        </div>
        <span className="text-[#848e9c] text-xs ml-1">
          ${symbolInfo && formatPrice(symbolInfo?.lastPrice)}
        </span>
        <div className="size-4 ml-auto">
          <ArrowRightIcon className="fill-[#848E9C] hover:fill-white cursor-pointer" />
        </div>
      </div>

      {/* OrderBook buy-content */}
      {(tabOrder === 1 || tabOrder === 2) && (
        <OrderBookDetail
          tabOrder={tabOrder}
          display="bids"
          bids={bids}
          asks={asks}
        />
      )}

      {/* OrderBook compare */}
      {tabOrder === 1 && <Comparation comparePercent={comparePercent} />}
    </div>
  );
};

export default OrderBook;
