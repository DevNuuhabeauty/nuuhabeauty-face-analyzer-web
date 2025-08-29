import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";

export interface DefaultAutoCompeteFieldsProps {
    suggestions: string[];
    handleSuggestionClick: (suggestion: string) => void;
}

const DefaultAutoCompeteFields = ({ suggestions, handleSuggestionClick }: DefaultAutoCompeteFieldsProps) => {
    return (
        <>
            {
                suggestions.length > 0 && (
                    <Card className="w-full mt-1 border border-gray-200 shadow-md rounded-lg overflow-hidden">
                        <ScrollArea className="h-64">
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between group border-b border-gray-100 last:border-0"
                                >
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-[#966c3b]/10 flex items-center justify-center mr-3">
                                            <span className="text-[#966c3b] font-medium text-xs">{suggestion?.substring(0, 2).toUpperCase() ?? ''}</span>
                                        </div>
                                        <span className="font-medium">{suggestion}</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </ScrollArea>
                    </Card>
                )
            }
            {
                suggestions.length === 0 && (
                    <div className="flex items-center justify-center h-48">
                        <p className="text-center text-gray-500">No suggestions found</p>
                    </div>
                )
            }
        </>
    )
}

export default DefaultAutoCompeteFields;