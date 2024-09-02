import React from "react";

interface Props {
  comparePercent?: { buy: string; sell: string };
}

const Comparation: React.FC<Props> = (props): JSX.Element => {
  const { comparePercent } = props;

  return (
    <div className="px-4 pb-2 flex items-center">
      <span className="text-[#eaecef] text-xs">{`B`}</span>
      <span className="text-[#2ebd85] text-xs ml-[2px]">{`${comparePercent?.buy}%`}</span>
      <div className="px-2 w-full flex items-center">
        <div
          className="bg-[#2ebd85] h-1 rounded-l-sm w-[50%] mr-[1px]"
          style={{
            width: `${comparePercent?.buy}%`,
          }}
        />
        <div
          className="bg-[#f6465d] h-1 rounded-r-sm w-[50%] ml-[1px]"
          style={{
            width: `${comparePercent?.sell}%`,
          }}
        />
      </div>
      <span className="text-[#f6465d] text-xs mr-[2px]">{`${comparePercent?.sell}%`}</span>
      <span className="text-[#eaecef] text-xs">{`S`}</span>
    </div>
  );
};

export default Comparation;
