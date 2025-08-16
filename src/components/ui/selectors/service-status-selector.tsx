'use client'
import { useServiceStatusSearch } from "@/hooks/hooks";

export const ServiceStatusSelector = () => {
    const { currentServiceStatus, setServiceStatus } = useServiceStatusSearch();

    return (
        <select
            name="serviced"
            className="w-fit border rounded-sm text-center"
            value={currentServiceStatus}
            onChange={(e) => setServiceStatus(e.target.value)}
        >
            <option value="false">Un-serviced</option>
            <option value="true">Serviced</option>
        </select>
    );
};
