import { AlertTriangle } from "lucide-react";

interface CitationCardProps {
    title: string;
    description: React.ReactNode;
    type: "success" | "warning" | "error";
}

const CitationCard = ({ title, description, type }: CitationCardProps) => {
    const getColorClasses = (type: "success" | "warning" | "error") => {
        switch (type) {
            case "success":
                return {
                    background: "bg-green-50",
                    border: "border-green-500",
                    text: "text-green-500",
                    title: "text-green-700",
                    description: "text-green-600"
                };
            case "warning":
                return {
                    background: "bg-orange-50",
                    border: "border-orange-500",
                    text: "text-orange-500",
                    title: "text-orange-700",
                    description: "text-orange-600"
                };
            case "error":
                return {
                    background: "bg-red-50",
                    border: "border-red-500",
                    text: "text-red-500",
                    title: "text-red-700",
                    description: "text-red-600"
                };
            default:
                return {
                    background: "bg-blue-50",
                    border: "border-blue-500",
                    text: "text-blue-500",
                    title: "text-blue-700",
                    description: "text-blue-600"
                };
        }
    }

    const colors = getColorClasses(type);

    return (
        <div className={`${colors.background} border-l-4 ${colors.border} p-4 rounded-md flex items-start w-full`}>
            <AlertTriangle className={`${colors.text} w-5 h-5 mt-0.5 mr-2 flex-shrink-0`} />
            <div>
                <p className={`font-medium text-xs md:text-sm ${colors.title}`}>{title}</p>
                <p className={`text-xs md:text-sm ${colors.description}`}>
                    {description}
                </p>
            </div>
        </div>
    )
}

export default CitationCard;