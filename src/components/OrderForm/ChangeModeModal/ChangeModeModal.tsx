import { useAppSelector } from "@/redux/hook";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import clsx from "clsx";
import React from "react";

interface Props {
  mode: "CROSS" | "ISOLATED";
  setMode: (mode: "CROSS" | "ISOLATED") => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangeModeModal: React.FC<Props> = (props): JSX.Element => {
  const { mode, setMode, isOpen, onOpenChange } = props;

  const symbol = useAppSelector((state) => state.websocket.symbol);

  const [currentMode, setCurrentMode] = React.useState(mode);

  const handlePress = (onClose: () => void) => {
    return () => {
      setMode(currentMode);
      onClose();
    };
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-xl">
              {`Chế độ Margin`}
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-base text-[#eaecef] font-bold">
                    {symbol}
                  </span>
                  <span className="text-xs text-[#eaecef] px-1 bg-[#2b3139]">{`Vĩnh cửu`}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    className={clsx("w-1/2", {
                      "border-[#f0b90b]": currentMode === "CROSS",
                    })}
                    variant="bordered"
                    onClick={() => setCurrentMode("CROSS")}
                  >{`Cross`}</Button>
                  <Button
                    className={clsx("w-1/2", {
                      "border-[#f0b90b]": currentMode === "ISOLATED",
                    })}
                    variant="bordered"
                    onClick={() => setCurrentMode("ISOLATED")}
                  >{`Isolated`}</Button>
                </div>
                <div className="flex gap-1">
                  <span className="text-xs text-[#848e9c]">{`*`}</span>
                  <span className="text-xs text-[#848e9c]">{`Chuyển chế độ margin chỉ áp dụng cho những hợp đồng được chọn.`}</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-xs text-[#848e9c]">{`*`}</span>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#848e9c]">{`Chế độ Cross Margin: Tất cả vị thế cross margin sử dụng cùng tài sản ký quỹ sẽ cùng chia sẻ số dư tài sản cross margin. Trong thời gian thanh lý, số dư tài sản ký quỹ của bạn cùng với tất cả vị thế đang mở có thể sẽ bị tịch thu.`}</span>
                    <span className="text-xs text-[#848e9c] mt-4">{`Chế độ Isolated Margin: Lượng margin của vị thế được giới hạn trong một khoảng nhất định. Nếu giảm xuống thấp hơn mức Margin Duy trì, vị thế sẽ bị thanh lý. Tuy nhiên, chế độ này cho phép bạn thêm hoặc gỡ margin tuỳ ý muốn.`}</span>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                radius="sm"
                className="w-full h-12 bg-[#fcd535] text-base text-[#202630] font-[600]"
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

export default ChangeModeModal;
