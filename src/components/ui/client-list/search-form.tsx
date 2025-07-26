export default function SearchForm() {
    return (
        <div className="flex gap-2">
            <input
                className="border rounded-sm p-2"
                placeholder="Search" />
            <div className="flex gap-2">
                <label className="flex items-center">Cutting Week </label>
                <select className="w-10 border rounded-sm ">
                    {[1, 2, 3, 4].map((week) => (
                        <option className="text-center" key={week} value={week}>
                            {week}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex gap-2">
                <label className="flex items-center">Cutting Day </label>
                <select className="w-28 border rounded-sm ">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <option className="text-center" key={day} value={day}>
                            {day}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}