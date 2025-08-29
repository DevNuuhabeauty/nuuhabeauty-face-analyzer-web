"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Label, LabelList, Rectangle, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { ConcernEntity } from "../../../entities/product-entity"

const chartConfig = {
    confidence: {
        label: "Confidence %",
    },
    oiliness: {
        label: "Oiliness",
        color: "hsl(var(--chart-1))",
    },
    dryness: {
        label: "Dryness",
        color: "hsl(var(--chart-2))",
    },
    acne: {
        label: "Acne",
        color: "hsl(var(--chart-3))",
    },
    aging: {
        label: "Aging",
        color: "hsl(var(--chart-4))",
    },
    pigmentation: {
        label: "Pigmentation",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360)
    const saturation = Math.floor(Math.random() * 30) + 70 // 70-100%
    const lightness = Math.floor(Math.random() * 20) + 40 // 40-60%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export function ConcernBarChart({ diseases }: {
    diseases: ConcernEntity[]
}) {
    const chartData = diseases
        .filter(disease => disease.name && disease.confidence_percent)
        .map(disease => ({
            name: disease.name || 'N/A',
            confidence: disease.confidence_percent || 0,
            fill: generateRandomColor()
        }))

    if (chartData.length === 0) {
        return null
    }

    const findHighestConfidence = () => {
        const result = diseases.find(disease => disease.confidence_percent === Math.max(...diseases.map(disease => disease.confidence_percent || 0)))
        return result?.name
    }

    const removeDuplicateConcerns = () => {
        const uniqueConcerns = diseases.filter((disease, index, self) =>
            index === self.findIndex(t => t.name === disease.name)
        );

        return uniqueConcerns.map(disease => ({
            name: disease.name,
            confidence: disease.confidence_percent ? (disease.confidence_percent * 100) : 0,
            fill: 'hsl(0, 80%, 50%)'
        }))
    }

    return (
        <ChartContainer
            className="w-full"
            config={chartConfig}>
            <BarChart

                accessibilityLayer
                data={removeDuplicateConcerns().sort((a, b) => b.confidence - a.confidence)}
                layout="vertical"
                margin={{
                    right: 16
                }}
            >
                <CartesianGrid horizontal={false} />
                <YAxis
                    dataKey="name"
                    hide
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}

                />
                <XAxis type="number" dataKey="confidence" hide />
                <ChartTooltip
                    cursor={false}
                    content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const data = payload[0].payload;
                        return (
                            <div className="rounded-lg bg-background border p-2 shadow-md flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: data.fill }} />
                                    <p className="text-sm font-medium">{data.name}</p>
                                </div>

                                <p className="text-xs text-muted-foreground font-light">
                                    Confidence: {data.confidence}%
                                </p>
                            </div>
                        );
                    }}
                />
                <Bar
                    dataKey="confidence"
                    layout="vertical"
                    radius={8}
                // activeIndex={0}
                // activeBar={({ ...props }) => {
                //     return (
                //         <Rectangle
                //             {...props}
                //             fillOpacity={0.8}
                //             stroke={props.payload.fill}
                //             strokeDasharray={4}
                //             strokeDashoffset={4}
                //         />
                //     )
                // }}

                >

                    <LabelList
                        dataKey="name"
                        position="insideLeft"
                        offset={8}
                        className="fill-white"
                        fontSize={12}
                    />

                    <LabelList
                        dataKey="confidence"
                        position="insideRight"
                        offset={8}
                        className="fill-white"
                        fontSize={12}
                        formatter={(value: number) => `${value}%`}
                    />
                </Bar>
            </BarChart>
        </ChartContainer>
    )
}
