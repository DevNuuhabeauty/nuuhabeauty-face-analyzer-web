import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { checkLocationinDescription } from "@/src/core/constant/helper";
import { Eye, ZoomIn, ArrowUpRight } from "lucide-react";

interface SkinFeatureCardProps {
    item: any;
    onClick?: () => void;
}

const SkinFeatureCard = ({ item, onClick }: SkinFeatureCardProps) => {
    const calculateWidth = (confidence_percent: number) => {
        return (confidence_percent * 1000) / 10;
    }

    return (
        <Card
            className="w-full hover:shadow-lg hover:shadow-red-100 transition-all duration-300 border-red-200 cursor-pointer group hover:scale-[1.02] hover:border-red-300 relative overflow-hidden"
            onClick={onClick}
        >
            {/* Clickable indicator overlay */}
            <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-red-500 text-white p-1.5 rounded-full shadow-lg">
                    <ZoomIn className="w-4 h-4" />
                </div>
            </div>

            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-50/0 to-red-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <CardContent className="p-4 relative">
                <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors">
                                {item.name}
                            </h3>
                            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                        </div>
                        {item.location_image_url && (
                            <div className="relative">
                                <img
                                    src={item.location_image_url}
                                    alt={item.name}
                                    className="w-10 h-10 rounded-full group-hover:ring-2 group-hover:ring-red-300 transition-all duration-200"
                                />
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <Eye className="w-3 h-3" />
                                </div>
                            </div>
                        )}
                    </div>

                    {item.confidence_percent !== undefined && (
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-bold group-hover:text-red-700 transition-colors">
                                    How Bad It Is
                                </p>
                                <div className="flex items-center">
                                    <span className="text-xs font-medium text-gray-600 group-hover:text-red-600 transition-colors">
                                        {item.confidence_percent * 100}%
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 group-hover:bg-gray-300 transition-colors">
                                <div
                                    className="h-2.5 rounded-full transition-all duration-300 group-hover:shadow-sm"
                                    style={{
                                        width: `${calculateWidth(item.confidence_percent)}%`,
                                        backgroundColor: '#ff0000'
                                    }}
                                />
                            </div>

                            <div className="flex justify-between text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">
                                <span>Mild</span>
                                <span>Severe</span>
                            </div>
                        </div>
                    )}

                    {item.ai_comment && (
                        <div className="flex p-3 bg-gray-50 rounded-lg group-hover:bg-red-50 transition-colors duration-200">
                            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors" dangerouslySetInnerHTML={{
                                __html: item.ai_comment.toLowerCase().includes('not detected')
                                    ? item.ai_comment
                                    : item.ai_comment.split(/\b/).map((word: string) => {
                                        const trimmedWord = word.trim();
                                        return checkLocationinDescription(trimmedWord, item.location || '') &&
                                            trimmedWord !== 'and'
                                            ? `<span class="font-bold text-red-500">${word}</span>`
                                            : word
                                    }).join('')
                            }} />
                        </div>
                    )}

                    {/* Click to view indicator */}
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400 group-hover:text-red-500 transition-colors pt-2 border-t border-gray-100 group-hover:border-red-200">
                        <Eye className="w-3 h-3" />
                        <span className="font-medium">Click to view full image</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default SkinFeatureCard;