'use client';
import { useUpdateCuttingDay } from "@/mutations/mutations";
import { Client, CuttingSchedule } from "@/types/types";

function CuttingWeekDropDown({
  week,
  schedule,
  clientId,
  isAdmin,
}: {
  week: number;
  schedule: CuttingSchedule;
  clientId: number;
  isAdmin: boolean;
}) {
  const days = [
    "No cut",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  // Ensure the cutting_day is either the schedule's cutting_day or "No cut"
  const cuttingDay = schedule.cutting_day ?? "No cut";

  const { mutate } = useUpdateCuttingDay();

  return (
    <p className="flex items-center">
      <span className="w-32">Cutting week {week}:</span>
      {isAdmin ? (
        <select
          className="w-28"
          value={cuttingDay}
          onChange={(event) =>
            mutate({ clientId, cuttingWeek: week, cuttingDay: event.target.value })
          }
        >
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      ) : (
        <span className="w-28">{cuttingDay}</span>
      )}
    </p>
  );
}

export function CuttingWeekDropDownContainer({
  client,
  isAdmin,
}: {
  client: Client;
  isAdmin: boolean;
}) {
  // Ensure all weeks (1–4) have a schedule, defaulting to "No cut" if missing
  const schedules: CuttingSchedule[] = Array.from({ length: 4 }, (_, i) => {
    const week = i + 1;
    const existingSchedule = client.cutting_schedules.find(
      (s) => s.cutting_week === week
    );
    return existingSchedule || { cutting_week: week, cutting_day: "No cut" };
  });

  return (
    <>
      {schedules.map((schedule, index) => (
        <CuttingWeekDropDown
          key={index}
          week={index + 1}
          schedule={schedule}
          clientId={client.id}
          isAdmin={isAdmin}
        />
      ))}
    </>
  );
}