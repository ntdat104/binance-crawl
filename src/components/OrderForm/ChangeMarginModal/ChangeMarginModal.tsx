import InfoRedIcon from "@/components/icons/InfoRedIcon";
import MinusIcon from "@/components/icons/MinusIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import { formatPrice } from "@/utils/format-price";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Slider,
} from "@nextui-org/react";
import React from "react";

interface Props {
  value: number;
  setValue: (value: number) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangeMarginModal: React.FC<Props> = (props): JSX.Element => {
  const { value, setValue, isOpen, onOpenChange } = props;

  const [currentValue, setCurrentValue] = React.useState(value);

  const handlePress = (onClose: () => void) => {
    return () => {
      setValue(currentValue);
      onClose();
    };
  };

  const position = React.useMemo(() => {
    if (currentValue > 1) {
      return formatPrice(50000, 0);
    }
    if (currentValue > 0.75) {
      return formatPrice(600000, 0);
    }
    if (currentValue > 0.5) {
      return formatPrice(3000000, 0);
    }
    if (currentValue > 0.25) {
      return formatPrice(12000000, 0);
    }
    if (currentValue > 0.2) {
      return formatPrice(70000000, 0);
    }
    if (currentValue > 0.1) {
      return formatPrice(100000000, 0);
    }
    if (currentValue > 0.05) {
      return formatPrice(230000000, 0);
    }
    if (currentValue <= 0.01) {
      return formatPrice(1800000000, 0);
    }
    return formatPrice(24000000 / currentValue, 0);
  }, [currentValue]);

  return (
    <Modal size="sm" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-xl">
              {`Điều chỉnh đòn bẩy`}
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col">
                <span className="text-sm text-[#b7bdc6] mb-1">{`Đòn bẩy`}</span>
                <div className="flex items-center justify-between h-12 bg-[#2b3139] rounded-md p-3 mb-4">
                  <div
                    className="w-6"
                    onClick={() =>
                      setCurrentValue((value) =>
                        value > 0 ? value - 0.01 : value
                      )
                    }
                  >
                    <MinusIcon className="fill-[#848E9C] hover:fill-white cursor-pointer" />
                  </div>
                  <span className="text-base text-[#eaecef] select-none">{`${Math.round(
                    currentValue * 100
                  )}x`}</span>
                  <div
                    className="w-6"
                    onClick={() =>
                      setCurrentValue((value) =>
                        value < 1.25 ? value + 0.01 : value
                      )
                    }
                  >
                    <PlusIcon className="fill-[#848E9C] hover:fill-white cursor-pointer" />
                  </div>
                </div>
                <Slider
                  size="sm"
                  step={0.01}
                  color="warning"
                  // showSteps={true}
                  formatOptions={{ style: "decimal" }}
                  maxValue={1.25}
                  minValue={0}
                  value={currentValue}
                  onChange={(value) => setCurrentValue(value as number)}
                  //   showTooltip={true}
                  marks={[
                    {
                      value: 0.01,
                      label: "1x",
                    },
                    {
                      value: 0.25,
                      label: "25x",
                    },
                    {
                      value: 0.5,
                      label: "50x",
                    },
                    {
                      value: 0.75,
                      label: "75x",
                    },
                    {
                      value: 1,
                      label: "100x",
                    },
                    {
                      value: 1.25,
                      label: "125x",
                    },
                  ]}
                />
                <ul className="list-disc pl-[18px] mt-5">
                  <li className="text-xs text-[#b7bdc6] mb-2">{`Vị thế tối đa ${position} USDT`}</li>
                  <li className="text-xs text-[#b7bdc6] mb-2">{`Xin lưu ý rằng việc thay đổi đòn bẩy cũng sẽ áp dụng cho các vị thế mở và lệnh đang mở.`}</li>
                </ul>
                <div className="flex">
                  <div className="!min-w-[14px] mr-1">
                    <InfoRedIcon className="fill-[#f6465d]" />
                  </div>
                  <span className="text-xs text-[#f6465d]">{`Khi chọn đòn bẩy cao hơn, chẳng hạn như [10x], rủi ro thanh lý sẽ tăng lên. Hãy luôn kiểm soát mức độ rủi ro của bạn. Xem bài viết trợ giúp của chúng tôi để biết thêm thông tin.`}</span>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                isDisabled={currentValue === 0}
                radius="sm"
                className="w-full h-10 bg-[#fcd535] text-base text-[#202630]"
                onPress={handlePress(onClose)}
              >
                {`Xác nhận`}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ChangeMarginModal;
