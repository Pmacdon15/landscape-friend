import { Client, CuttingSchedule } from "@/types/types";

function CuttingWeekDropDown({ week, schedule }: { week: number, schedule: CuttingSchedule }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "No cut"];
  const cuttingDay = schedule.cutting_day || "No cut";

  return (
    <p className="flex items-center">
      <span className="w-32">Cutting week {week}:</span>
      <select className="w-28" defaultValue={cuttingDay}>
        {days.map((day) => (
          <option key={day} > {day} </option>
        ))}
      </select>
    </p>
  );
}

export function CuttingWeekDropDownContainer({ client }: { client: Client }) {
  const schedules = client.cutting_schedules;
  const weeks = Array.from({ length: 4 }, (_, i) => {
    const schedule = schedules[i];
    return {
      cutting_week: schedule ? schedule.cutting_week : null,
      cutting_day: schedule ? schedule.cutting_day : null,
    };
  });

  return (
    <>
      {weeks.map((schedule, index) => (
        <CuttingWeekDropDown key={index} week={index + 1} schedule={schedule} />
      ))}
    </>
  );
}