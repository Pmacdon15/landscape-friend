'use client';
import { useUpdateServiceDay } from "@/mutations/mutations";
import { Client, ServiceSchedule } from "@/types/types";

function ServiceWeekDropDown({
  week,
  schedule,
  clientId,
  isAdmin,
}: {
  week: number;
  schedule: ServiceSchedule;
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
  
  const serviceDay = schedule.service_day ?? "No service";

  const { mutate } = useUpdateServiceDay();

  return (
    <p className="flex items-center">
      <span className="w-32">Service week {week}:</span>
      {isAdmin ? (
        <select
          className="w-28"
          value={serviceDay}
          onChange={(event) =>
            mutate({ clientId, serviceWeek: week, serviceDay: event.target.value })
          }
        >
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      ) : (
        <span className="w-28">{serviceDay}</span>
      )}
    </p>
  );
}

export function ServiceWeekDropDownContainer({
  client,
  isAdmin,
}: {
  client: Client;
  isAdmin: boolean;
}) {
  // Ensure all weeks (1–4) have a schedule, defaulting to "No cut" if missing
  const schedules: ServiceSchedule[] = Array.from({ length: 4 }, (_, i) => {
    const week = i + 1;
    const existingSchedule = client.service_schedules.find(
      (s) => s.service_week === week
    );
    return existingSchedule || { service_week: week, service_day: "No service" };
  });

  return (
    <>
      {schedules.map((schedule, index) => (
        <ServiceWeekDropDown
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