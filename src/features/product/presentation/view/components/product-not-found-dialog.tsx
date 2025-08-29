import React from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { AlertTriangle, Search, Camera, RefreshCw } from 'lucide-react';

interface ProductNotFoundDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onRetry?: () => void;
    onSearchAlternative?: () => void;
    trigger?: React.ReactNode;
}

const ProductNotFoundDialog: React.FC<ProductNotFoundDialogProps> = ({
    isOpen,
    onOpenChange,
    onRetry,
    onSearchAlternative,
    trigger
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {trigger && (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            )}

            <DialogContent className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] px-4 md:px-6 rounded-xl">
                <div className="p-6">
                    <DialogHeader className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-amber-600" />
                        </div>

                        <DialogTitle className="text-xl font-semibold">
                            Product Not Found
                        </DialogTitle>

                        <DialogDescription className="text-sm text-gray-600 leading-relaxed space-y-2">
                            <p>
                                We couldn't locate this product in our database. This may occur if:
                            </p>
                            <ul className="text-left list-disc list-inside space-y-1 mt-3">
                                <li>The product is not yet catalogued in our system</li>
                                <li>The image quality affects recognition accuracy</li>
                                <li>The product packaging has been recently updated</li>
                                <li>The barcode or text is not clearly visible</li>
                            </ul>
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="bg-gray-50 px-6 py-4 space-y-3 rounded-xl">
                    <p className="text-sm font-medium text-gray-700 mb-3">What would you like to do?</p>

                    <div className="grid grid-cols-1 gap-2">
                        {onRetry && (
                            <Button
                                onClick={() => {
                                    onRetry();
                                    onOpenChange(false);
                                }}
                                className="w-full bg-[#966c3b] hover:bg-[#966c3b]/90 text-white flex items-center gap-2 justify-center"
                            >
                                <Camera className="w-4 h-4" />
                                Try Scanning Again
                            </Button>
                        )}

                        {onSearchAlternative && (
                            <Button
                                onClick={() => {
                                    onSearchAlternative();
                                    onOpenChange(false);
                                }}
                                variant="outline"
                                className="w-full border-[#966c3b] text-[#966c3b] hover:bg-[#966c3b]/10 flex items-center gap-2 justify-center"
                            >
                                <Search className="w-4 h-4" />
                                Search Manually
                            </Button>
                        )}

                        <Button
                            onClick={() => onOpenChange(false)}
                            variant="ghost"
                            className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductNotFoundDialog;