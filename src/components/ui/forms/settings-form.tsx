export default function SettingsForm({ children }: { children: React.ReactNode }) {
    return (
        <form className="flex gap-4 flex-col">
            {children}
        </form>
    );
}