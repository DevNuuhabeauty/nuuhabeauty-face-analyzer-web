import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";

export interface DefaultListProps {
    content: (item: any) => ReactNode;
    data: any[];
}

const DefaultList = ({ content, data }: DefaultListProps) => {
    const [isLimit, setIsLimit] = useState(true);
    const itemLimit = 5;

    const displayData = isLimit ? data.slice(0, itemLimit) : data;

    return (
        <div className="flex flex-col gap-4">
            {displayData.map((item, index) => (
                <div key={index}>
                    {content(item)}
                </div>
            ))}

            {data.length > itemLimit && (
                <Button
                    onClick={() => setIsLimit(!isLimit)}
                    variant="outline"
                >
                    {isLimit ? 'Show More' : 'Show Less'}
                </Button>
            )}
        </div>
    )
}

export default DefaultList;
