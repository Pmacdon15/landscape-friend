import { ReactNode } from 'react';

export default function SettingsDisplayItem({ label, children, actions }: { label: string, children: ReactNode, actions: ReactNode }) {
    return (
        <div className="flex items-center gap-4 w-full">
            <div className="flex w-96 items-center gap-4">
                <label className="w-32 ">{label}</label>
                <div className="flex-1">
                    {children}
                </div>
            </div>
            <div className="flex-1 w-32">
                {actions}
            </div>
        </div>
    );
}
