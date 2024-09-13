import {Tabs, Tab} from "@nextui-org/react";
const TabList = () => {

  return (
    <div className="flex flex-wrap gap-4">
        <Tabs color={"warning"} variant='underlined' aria-label="Tabs variants">
          <Tab key="vithe"  title={
                <span className="text-sm font-bold text-[#ffffff]">{`Vị thế (0)`}</span>
              }
            />
          <Tab key="gdckl" title={
                <span className="text-sm font-bold text-[#ffffff]">{`Giao dịch chờ khớp lệnh`}</span>
              } />
        <Tab key="lsl" 
          title={
                <span className="text-sm font-bold text-[#ffffff]">{`Lịch sử lệnh`}</span>
              }
        />
        <Tab key="lsgd" 
           title={
                <span className="text-sm font-bold text-[#ffffff]">{`Lịch sử giao dịch`}</span>
              }
        />
        <Tab key="lssd" 
           title={
                <span className="text-sm font-bold text-[#ffffff]">{`Lịch sử số dư`}</span>
              }
        />
          <Tab key="lsvt" title={
                <span className="text-sm font-bold text-[#ffffff]">{`Lịch sử vị thế`}</span>
              }/>
        <Tab key="cl" 
        title={
                <span className="text-sm font-bold text-[#ffffff]">{`Chiến lược`}</span>
              }/>
        <Tab key="ts"
          title={
                <span className="text-sm font-bold text-[#ffffff]">{`Tài sản`}</span>
              }
        />
        </Tabs>
    </div>
  );
};

export default TabList;