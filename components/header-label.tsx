export default function HeaderLabel({ text }: { text: string }) {
    return (
        <div className="bg-secondary-background w-[300px] md:w-[450px] p-3 flex flex-col gap-3 rounded-md border shadow-[6px_6px_0px_#000]">
            <h1 className="text-2xl font-bold text-center">{text}</h1>
        </div>
    );
}