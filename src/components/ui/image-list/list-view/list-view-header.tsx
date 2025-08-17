export default function ListViewHeader({ text }: { text: string }) {
    return (
        <div className="text-white w-full text-xl font-bold text-center my-3">
            ⚠️ No Images Saved yet !
            {text}
        </div>
    );
} 
