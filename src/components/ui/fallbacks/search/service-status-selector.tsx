export const ServiceStatusSelectorFallback = () => {
  
    return (
        <select
            name="serviced"
            className="w-fit border rounded-sm text-center p-2"            
        >
            <option value="false">Un-serviced</option>
            <option value="true">Serviced</option>
        </select>
    );
};
