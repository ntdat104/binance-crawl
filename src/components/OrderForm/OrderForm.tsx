import { Button, Divider, Slider, Tooltip } from "@nextui-org/react";
import clsx from "clsx";
import React from "react";
import InfoIcon from "../icons/InfoIcon";
import ArrowDownIcon from "../icons/ArrowDownIcon";

interface Props extends React.ComponentPropsWithoutRef<"div"> {}

const OrderForm: React.FC<Props> = (props): JSX.Element => {
  const { className, ...rest } = props;
  const [tabOrder, setTabOrder] = React.useState<"LIMIT" | "MARKET" | "CUSTOM">(
    "LIMIT"
  );
  const [mode] = React.useState<"CROSS" | "ISOLATED">("CROSS");
  const [margin] = React.useState(40);

  const modeText = React.useMemo(() => {
    if (mode === "CROSS") {
      return "Cross";
    }
    if (mode === "ISOLATED") {
      return "Isolated";
    }
    return null;
  }, [mode]);

  return (
    <div className={clsx("w-full h-full", className)} {...rest}>
      <div className="flex items-center gap-2 py-[10px] px-4">
        <Button className="h-6 w-1/2 bg-[#2b3139] hover:!opacity-80" size="sm">
          {modeText}
        </Button>
        <Button
          className="h-6 w-1/2 bg-[#2b3139] hover:!opacity-80"
          size="sm"
        >{`${margin}%`}</Button>
      </div>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <span
            className={clsx(
              "text-sm text-[#848e9c] cursor-pointer hover:text-[#f0b90b] mr-4",
              {
                "text-[#f0b90b]": tabOrder === "LIMIT",
              }
            )}
            onClick={() => setTabOrder("LIMIT")}
          >{`Giới hạn`}</span>
          <span
            className={clsx(
              "text-sm text-[#848e9c] cursor-pointer hover:text-[#f0b90b] mr-4",
              {
                "text-[#f0b90b]": tabOrder === "MARKET",
              }
            )}
            onClick={() => setTabOrder("MARKET")}
          >{`Thị trường`}</span>
          <span
            className={clsx(
              "text-sm text-[#848e9c] cursor-pointer hover:text-[#f0b90b]",
              {
                "text-[#f0b90b]": tabOrder === "CUSTOM",
              }
            )}
            onClick={() => setTabOrder("CUSTOM")}
          >{`Stop Limit`}</span>
          <div className="size-4">
            <ArrowDownIcon className="fill-[#848E9C] hover:fill-white cursor-pointer" />
          </div>
        </div>
        <Tooltip
          showArrow={true}
          placement="top-end"
          content={`Lệnh thị trường (market) sẽ khớp ngay với mức giá thị trường tốt nhất hiện có.`}
        >
          <div className="size-4">
            <InfoIcon className="fill-[#848E9C] hover:fill-white cursor-pointer" />
          </div>
        </Tooltip>
      </div>
      <div className="flex items-center px-4 py-2">
        <span className="mr-1 text-xs text-[#848e9c]">{`Số dư khả dụng`}</span>
        <span className="mr-1 text-xs text-[#eaecef]">{`0.00 USDT`}</span>
      </div>
      <div className="flex items-center px-4 my-2">
        <div className="w-full h-10 bg-[#2b3139] border border-transparent hover:border-[#f0b90b] rounded flex items-center px-2">
          <span className="text-sm text-[#848e9c] whitespace-nowrap">{`Giá`}</span>
          <input
            className="outline-none bg-transparent border-none text-sm text-[#eaecef] text-right w-full px-1"
            type="number"
            step={`0.1`}
            min={0}
          />
          <span className="ml-1 text-sm text-[#eaecef] whitespace-nowrap">{`USDT`}</span>
        </div>
      </div>
      <div className="flex items-center px-4 my-2">
        <div className="w-full h-10 bg-[#2b3139] border border-transparent hover:border-[#f0b90b] rounded flex items-center px-2">
          <span className="text-sm text-[#848e9c] whitespace-nowrap">{`Số lượng`}</span>
          <input
            className="outline-none bg-transparent border-none text-sm text-[#eaecef] text-right w-full px-1"
            type="number"
            step={`0.1`}
            min={0}
          />
          <span className="ml-1 text-sm text-[#eaecef] whitespace-nowrap">{`USDT`}</span>
        </div>
      </div>
      <div className="flex items-center px-4 py-2">
        <Slider
          size="sm"
          step={0.25}
          color="warning"
          showSteps={true}
          formatOptions={{ style: "percent" }}
          maxValue={1}
          minValue={0}
          defaultValue={0}
          className="max-w-md"
          showTooltip={true}
        />
      </div>
      <div className="flex items-center justify-between px-4 py-1">
        <div>
          <span className="text-xs text-[#848e9c]">{`Mua`}</span>
          <span className="ml-1 text-xs text-[#eaecef]">{`0.0 USDT`}</span>
        </div>
        <div>
          <span className="text-xs text-[#848e9c]">{`Bán`}</span>
          <span className="ml-1 text-xs text-[#eaecef]">{`0.0 USDT`}</span>
        </div>
      </div>
      <div className="px-4 py-2">
        <Divider />
      </div>
      <div className="px-4 py-2 flex items-center gap-2">
        <Button radius="sm" className="bg-[#2ebd85] h-9 w-1/2">
          <span className="text-sm font-bold text-[#ffffff]">{`Mua/Long`}</span>
        </Button>
        <Button radius="sm" className="bg-[#f6465d] h-9 w-1/2">
          <span className="text-sm font-bold text-[#ffffff]">{`Bán/Short`}</span>
        </Button>
      </div>
      <div className="px-4 py-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-[#848e9c]">{`Chi phí`}</span>
            <span className="ml-1 text-xs text-[#eaecef]">{`0.0 USDT`}</span>
          </div>
          <div>
            <span className="text-xs text-[#848e9c]">{`Chi phí`}</span>
            <span className="ml-1 text-xs text-[#eaecef]">{`0.0 USDT`}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-[#848e9c]">{`Tối đa`}</span>
            <span className="ml-1 text-xs text-[#eaecef]">{`0.0 USDT`}</span>
          </div>
          <div>
            <span className="text-xs text-[#848e9c]">{`Tối đa`}</span>
            <span className="ml-1 text-xs text-[#eaecef]">{`0.0 USDT`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;