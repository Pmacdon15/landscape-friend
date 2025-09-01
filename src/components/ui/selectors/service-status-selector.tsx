'use client'
import { useServiceStatusSearch } from "@/lib/hooks/hooks";

export const ServiceStatusSelector = () => {
    const { currentServiceStatus, setServiceStatus } = useServiceStatusSearch();

    return (
        <select
            name="serviced"
            className="w-fit border rounded-sm text-center p-2"
            value={currentServiceStatus}
            onChange={(e) => setServiceStatus(e.target.value)}
        >
            <option value="false">Un-serviced</option>
            <option value="true">Serviced</option>
        </select>
    );
};
