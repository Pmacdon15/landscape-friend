export const ServiceStatusSelectorFallback = () => {
    return (
        <select
            name="serviced"
            className="w-fit border rounded-sm text-center"
        >
            <option value="false">Un-serviced</option>
            <option value="true">Serviced</option>
        </select>
    );
};
