function CuttingWeekDropDown({ week }: { week: number }) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "No cut"];
    return (
        <p className="flex items-center">
            <span className="w-32">Cutting week {week}:</span>
            <select className="w-28">
                {days.map((day) => (
                    <option key={day} > {day} </option>
                ))}
            </select>
        </p>
    );
}

export function CuttingWeekDropDownContainer() {
    return (
        <>
            <CuttingWeekDropDown week={1} />
            <CuttingWeekDropDown week={2} />
            <CuttingWeekDropDown week={3} />
            <CuttingWeekDropDown week={4} />
        </>
    );
}