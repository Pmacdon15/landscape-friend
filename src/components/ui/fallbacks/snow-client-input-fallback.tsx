export default function SnowClientInputFallback() {

    return (
        <div className="flex flex-col">
            <div className="flex gap-2">
                <input
                    type="checkbox"
                    id={`snow-removal-`}
                    name="snow-removal"
                />
                <label htmlFor={`snow-removal-`}>Snow Removal</label>
            </div>
            <div className="flex gap-2 mb-2">
                <p className="align-middle w-28">Assigned to : </p>
                <select
                    className="  rounded-sm border md:w-2/6  w-3/6 p-1"
                    defaultValue={"not-assigned"}

                >
                    <option value="not-assigned">Not Assigned</option>

                </select>
            </div>
        </div>
    );
}