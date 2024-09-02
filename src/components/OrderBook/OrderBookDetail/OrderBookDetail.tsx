import { formatPrice } from "@/utils/format-price";
import { Tooltip } from "@nextui-org/react";
import clsx from "clsx";
import React from "react";

interface Props {
  display: "bids" | "asks";
  asks?: string[][];
  bids?: string[][];
}

const OrderBookDetail: React.FC<Props> = (props): JSX.Element => {
  const { display = "asks", asks, bids } = props;

  const [currentIndex, setCurrentIndex] = React.useState(-1);

  const value = React.useMemo(
    () => (display === "bids" ? bids : asks),
    [bids, asks, display]
  );
  const color = React.useMemo(
    () => (display === "bids" ? "#2ebd85" : "#f6465d"),
    [display]
  );
  const bgColor = React.useMemo(
    () => (display === "bids" ? "#2ebd851a" : "#f6465e1a"),
    [display]
  );

  const renderTooltipContent = (value: string[][], index: number) => {
    const newValue = [...value].slice(0, index + 1);
    const average =
      newValue.reduce((acc, item) => acc + Number(item[0]), 0) /
      newValue.length;
    const totalBtc = newValue.reduce((acc, item) => acc + Number(item[1]), 0);
    const totalUsdt = newValue.reduce(
      (acc, item) => acc + Number(item[0]) * Number(item[1]),
      0
    );

    return (
      <div className="w-[200px] py-1">
        <div className="flex items-center justify-between py-[2px]">
          <span className="text-sm">{`Giá trung bình:`}</span>
          <span>{`≈ ${formatPrice(average, 5)}`}</span>
        </div>
        <div className="flex items-center justify-between py-[2px]">
          <span className="text-sm">{`Tổng BTC:`}</span>
          <span>{`${formatPrice(totalBtc, 5)}`}</span>
        </div>
        <div className="flex items-center justify-between py-[2px]">
          <span className="text-sm">{`Tổng USDT:`}</span>
          <span>{`${formatPrice(totalUsdt, 5)}`}</span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={clsx(
        "px-4 py-2",
        display === "asks" && "flex flex-col-reverse"
      )}
    >
      {value?.map((item, index) => (
        <Tooltip
          showArrow={true}
          classNames={{
            base: "ml-[6px]",
            content: "rounded-[6px]",
          }}
          placement="right"
          content={renderTooltipContent(value, index)}
          delay={0}
          closeDelay={0}
          key={index}
          disableAnimation={true}
          onOpenChange={(open) => {
            if (open) {
              setCurrentIndex(index);
            } else {
              setCurrentIndex(-1);
            }
          }}
        >
          <div
            className={clsx(
              "flex items-center h-5 cursor-pointer relative before:content-[''] before:absolute before:w-full before:h-full",
              `first:before:bg-[${bgColor}]`,
              Number(item[0]) * Number(item[1]) > 10000 &&
                `before:bg-[${bgColor}]`,
              index <= currentIndex && "bg-[#2b313966]",
              index === currentIndex &&
                `${
                  display === "bids" ? "border-b" : "border-t"
                } border-dashed border-[#474d577c]`
            )}
            key={index}
          >
            <span className={`text-[${color}] text-xs w-1/3 text-left`}>
              {formatPrice(item[0], 2)}
            </span>
            <span className="text-[#eaecef] text-xs w-1/3 text-right">
              {formatPrice(item[1], 5)}
            </span>
            <span className="text-[#eaecef] text-xs w-1/3 text-right">{`${formatPrice(
              Number(item[0]) * Number(item[1]),
              5
            )}`}</span>
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

export default OrderBookDetail;
