import React from "react";

const DateBlock = ({ tasksDone, totalTasks, date }) => (
  <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
    {date && (
      <>
        <span className="font-medium text-black">{date}</span>
        <div className="group h-16 w-full flex-grow cursor-pointer py-1 md:h-30">
          <span className="text-black md:hidden">
            {tasksDone ?? 0} / {totalTasks ?? 0}
          </span>
        </div>
      </>
    )}
  </td>
);

const Calendar = ({ tasksVsDate, user }) => {
  return (
    <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <table className="w-full">
        <thead>
          <tr className="grid grid-cols-7 rounded-t-sm bg-primary text-white">
            <th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Sunday </span>
              <span className="block lg:hidden"> Sun </span>
            </th>
            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Monday </span>
              <span className="block lg:hidden"> Mon </span>
            </th>
            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Tuesday </span>
              <span className="block lg:hidden"> Tue </span>
            </th>
            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Wednesday </span>
              <span className="block lg:hidden"> Wed </span>
            </th>
            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Thursday </span>
              <span className="block lg:hidden"> Thur </span>
            </th>
            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Friday </span>
              <span className="block lg:hidden"> Fri </span>
            </th>
            <th className="flex h-15 items-center justify-center rounded-tr-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Saturday </span>
              <span className="block lg:hidden"> Sat </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="grid grid-cols-7">
            <DateBlock date={1} tasksDone={tasksVsDate[1]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={2} tasksDone={tasksVsDate[2]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={3} tasksDone={tasksVsDate[3]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={4} tasksDone={tasksVsDate[4]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={5} tasksDone={tasksVsDate[5]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={6} tasksDone={tasksVsDate[6]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={7} tasksDone={tasksVsDate[7]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
          </tr>
          <tr className="grid grid-cols-7">
            <DateBlock date={8} tasksDone={tasksVsDate[8]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={9} tasksDone={tasksVsDate[9]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={10} tasksDone={tasksVsDate[10]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={11} tasksDone={tasksVsDate[11]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={12} tasksDone={tasksVsDate[12]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={13} tasksDone={tasksVsDate[13]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={14} tasksDone={tasksVsDate[14]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
          </tr>
          <tr className="grid grid-cols-7">
            <DateBlock date={15} tasksDone={tasksVsDate[15]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={16} tasksDone={tasksVsDate[16]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={17} tasksDone={tasksVsDate[17]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={18} tasksDone={tasksVsDate[18]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={19} tasksDone={tasksVsDate[19]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={20} tasksDone={tasksVsDate[20]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={21} tasksDone={tasksVsDate[21]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
          </tr>
          <tr className="grid grid-cols-7">
            <DateBlock date={22} tasksDone={tasksVsDate[22]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={23} tasksDone={tasksVsDate[23]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={24} tasksDone={tasksVsDate[24]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={25} tasksDone={tasksVsDate[25]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={26} tasksDone={tasksVsDate[26]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={27} tasksDone={tasksVsDate[27]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={28} tasksDone={tasksVsDate[28]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
          </tr>
          <tr className="grid grid-cols-7">
            <DateBlock date={29} tasksDone={tasksVsDate[29]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={30} tasksDone={tasksVsDate[30]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock date={31} tasksDone={tasksVsDate[31]?.length ?? 0} totalTasks={user.tasks?.length ?? 0} />
            <DateBlock />
            <DateBlock />
            <DateBlock />
            <DateBlock />
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
