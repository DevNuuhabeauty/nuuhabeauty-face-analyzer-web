const ConcernChip = ({ title, value }: { title: string, value: string }) => {
    return (
        <div className="rounded-full px-4 py-1 shadow-sm bg-background border hover:scale-125 transition-all duration-500 cursor-pointer">
            <span className="text-sm font-medium gap-1 flex">{title}:
                <span className="text-sm font-extrabold" >
                    {value}
                </span>
            </span>

        </div>
    )
}

export default ConcernChip;