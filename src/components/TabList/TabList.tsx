import {Tabs, Tab} from "@nextui-org/react";
const TabList = () => {

  return (
    <div className="flex flex-wrap gap-4">
        <Tabs variant='underlined' aria-label="Tabs variants">
          <Tab key="vithe" title="Vị thế (0)" />
          <Tab key="gdckl" title="Giao dịch chờ khớp lệnh"/>
          <Tab key="lsl" title="Lịch sử lệnh"/>
          <Tab key="lsgd" title="Lịch sử giao dịch"/>
          <Tab key="lssd" title="Lịch sử số dư"/>
          <Tab key="lsvt" title="Lịch sử vị thế"/>
          <Tab key="cl" title="Chiến lược"/>
          <Tab key="ts" title="Tài sản"/>
        </Tabs>
    </div>
  );
};

export default TabList;