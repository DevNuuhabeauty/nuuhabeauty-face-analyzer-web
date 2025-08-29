import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"



const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig



export const NuuhaMeter = ({ value }: { value: number }) => {


    const getLabel = (value: number) => {
        if (value >= 100) return "Excellent";
        if (value >= 60) return "Moderate";
        if (value >= 25) return "Concerning";
        return "Very Low";
    }

    const getColor = (value: number) => {
        if (value >= 100) return 'green';
        if (value >= 60) return '#FFBF00';
        if (value >= 25) return '#ef4444';
        return '#22c55e';
    }



    const chartData = [{ label: getLabel(value), score: value, mobile: 100 - value }]

    const totalVisitors = chartData[0].score + chartData[0].mobile

    return (


        <div className="flex flex-row items-center justify-start w-full gap-2">
            <div className="relative w-14 h-14">
                <div className="absolute w-14 h-14 rounded-full border-4 border-gray-200" />
                <div
                    className="absolute w-14 h-14 rounded-full border-4"
                    style={{
                        clipPath: `polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 0 100%, 0 0, 50% 0)`,
                        transform: `rotate(${(value / 100) * 360}deg)`,
                        borderColor: getColor(value)
                    }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                    {value}
                </div>
            </div>
            <p className="text-xs font-medium">{getLabel(value)}</p>
        </div>



    );
}

const NuhaSlider = ({ value }: { value: number }) => {
    const getColor = (value: number) => {
        if (value >= 100) return 'green';
        if (value >= 60) return '#FFBF00';
        if (value >= 25) return '#ef4444';
        return '#22c55e';
    }

    const color = getColor(value);

    return (
        <div className={`w-24 h-5 bg-white dark:bg-gray-200 dark:border-black border-gray-900 border-2 rounded-full overflow-visible flex items-center relative`}>
            <div
                className="h-full rounded-full"
                style={{
                    backgroundColor: color,
                    width: `${value}%`,
                    transition: 'width 0.3s ease-in-out'
                }}
            />
            <div
                className="absolute -top-1 w-6 h-6 rounded-full transform -translate-x-1/2 border-2 border-gray-900"
                style={{
                    backgroundColor: color,
                    left: `${value}%`,
                    transition: 'left 0.3s ease-in-out'
                }}
            />
        </div>
    );
}
