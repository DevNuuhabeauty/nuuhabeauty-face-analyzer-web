import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const DefaultButton = ({ title, isLoading, variant, onClick, className }: { title: string, isLoading: boolean, variant: ButtonProps["variant"], onClick: () => void, className?: string }) => {
    return (
        <Button
            disabled={isLoading}
            variant={variant}
            onClick={onClick}
            className={className}
        >
            {
                isLoading && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                )
            }
            {title}
        </Button>
    )
}

export default DefaultButton;