const DataCard = ({ title, data, desc, icon }: { title: string, data: string, desc: string, icon: React.ReactNode }) => {
    return (
        <div className="rounded-xl p-4 border hover:scale-105 transition-all duration-500 cursor-pointer">
            <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-sm md:text-lg font-semibold">
                        {title}
                    </h1>
                    {icon}
                </div>

                <div className="flex flex-col items-start justify-center">
                    <p className="text-md md:text-2xl font-semibold line-clamp-1">
                        {data}
                    </p>

                    <p className="text-xs text-light text-muted-foreground line-clamp-1">
                        {desc}
                    </p>
                </div>
            </div>
        </div>
    )
}


export default DataCard;