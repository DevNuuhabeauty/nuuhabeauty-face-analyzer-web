import { ResearchEntity } from "../../../entities/research-entity";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, ExternalLinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResearchCardProps {
    research: ResearchEntity;
    index: number;
    expandedIds: Set<number>;
    toggleExpand: (id: number) => void;
    extractYear: (citation: string) => string | null;
    extractJournal: (citation: string) => string;
}

const ResearchCard = ({
    research,
    index,
    expandedIds,
    toggleExpand,
    extractYear,
    extractJournal
}: ResearchCardProps) => {
    const year = extractYear(research.citation);
    const journal = extractJournal(research.citation);

    return (
        <Card className="overflow-hidden border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold leading-tight line-clamp-2">
                    {research.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {year && (
                        <Badge variant="outline" className="text-xs font-normal text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {year}
                        </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs font-normal flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {journal}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pb-2">
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {research.citation}
                </p>
                <div className={cn(
                    "text-sm relative",
                    expandedIds.has(index) ? '' : 'max-h-[4.5rem] overflow-hidden'
                )}>
                    <p>{research.snippet}</p>
                    {!expandedIds.has(index) && (
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent" />
                    )}
                </div>
            </CardContent>

            <CardFooter className="flex justify-between pt-0">
                <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto text-xs font-medium text-primary hover:text-primary/80 hover:bg-transparent"
                    onClick={() => toggleExpand(index)}
                >
                    {expandedIds.has(index) ? 'View Less' : 'View More'}
                </Button>

                <div className="flex gap-2">
                    {/* <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        title="Read full article"
                    >
                        <BookOpenIcon className="h-4 w-4" />
                    </Button> */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        title="Open external link"
                        onClick={() => window.open(research.url, '_blank')}
                    >
                        <ExternalLinkIcon className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default ResearchCard;