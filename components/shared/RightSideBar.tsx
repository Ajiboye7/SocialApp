import React from "react";

const RightSideBar = () => {
  return (
    <section className="bg-dark-2 pt-30 w-fit sticky right-0 top-0 z-20 px-10 max-xl:hidden ">
      <div className=" flex flex-col gap-24 h-1/2 justify-between">
        <div className="flex flex-col gap-5 w-[350px]">
          <h3 className=" text-[20px] font-[500] leading-[140%] text-light-1">
            Suggested communities
          </h3>
          <p className="text-light-3">No community yet</p>
        </div>
        <div className="flex flex-col gap-5 w-[350px]">
          <h3 className=" text-[20px] font-[500] leading-[140%] text-light-1">
            Similar minds
          </h3>
          <p className="text-light-3">No user yet</p>
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;
