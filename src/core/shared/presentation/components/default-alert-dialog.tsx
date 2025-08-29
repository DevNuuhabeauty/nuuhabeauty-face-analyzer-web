import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2Icon } from "lucide-react";

export function DefaultAlertDialog({
    title,
    description,
    onConfirm,
    onCancel,
    widget,
    isLoading
}: {
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    widget: React.ReactNode;
    isLoading?: boolean;
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {widget}
            </AlertDialogTrigger>
            <AlertDialogContent className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] px-4 md:px-6">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-500"
                        onClick={onConfirm}
                    >
                        {isLoading ? <Loader2Icon className="w-4 h-4 animate-spin mr-2" /> : null}
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
