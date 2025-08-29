
import Image from "next/image";

const AnalyzeCard = () => {
    return (
        <div className="grid w-full grid-cols-12  hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors py-2 hover:rounded-lg">
            <div className="col-span-2 flex items-center gap-3">
                <Image
                    src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYrUXXRrsJEkNABDN4RiOfiY59_mnqwmASZQ&s'}
                    alt={'N/A'}
                    width={30}
                    height={30}
                    className="rounded-full"
                />
                <div className="flex flex-col">
                    <p className="text-sm font-medium">{'Bitcoin'}</p>
                    <p className="text-xs text-muted-foreground">{'BTC'}</p>
                </div>
            </div>
            <DataRow value={100000} />
            <div className="col-span-2 flex items-center">
                <p className={`text-sm font-medium ${(100000) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {(100000) > 0 ? '▲' : '▼'} {100000?.toFixed(2) ?? 'N/A'}%
                </p>
            </div>
            <DataRow value={100000} />
            <DataRow value={100000} />
            <NuhaMeeters />

        </div>
    );
};

const DataRow = ({ value }: { value: number }) => {
    return (
        <div className="col-span-2 flex items-center">
            <p className="text-sm font-medium">{value}</p>
        </div>
    );
}

const NuhaMeeters = () => {
    return (
        <div className="col-span-2 flex items-center">
            <div className="flex flex-col items-center gap-2">
                <p className="text-xs font-medium underline">100</p>
                <NuhaSlider value={60} />
                <p className="text-xs font-medium">Extreme</p>
            </div>
        </div>
    );
}

const NuhaSlider = ({ value }: { value: number }) => {

    const color = value > 50 ? 'green' : 'red';


    return (
        <div className={`w-24 h-5 bg-white dark:bg-gray-200 dark:border-black border-gray-900 border-2 rounded-full overflow-visible flex items-center relative`}>
            <div
                className="h-full rounded-full"
                style={{
                    backgroundColor: color,
                    width: `${value}%`
                }}

            />

            <div
                className="absolute -top-1 left-1/2 w-6 h-6 rounded-full transform -translate-x-1/2 border-2 border-gray-900"
                style={{
                    backgroundColor: color,
                }}
            />

            {/* <div className="absolute -top-1 left-3/4 w-6 h-6 bg-blue-500 rounded-full transform -translate-x-1/2 border-2 border-white"></div> */}

        </div>
    );
}

export default AnalyzeCard;