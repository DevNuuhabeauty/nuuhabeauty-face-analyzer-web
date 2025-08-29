"use client"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertCircle, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

const IngredientDisclaimerModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        const disclaimerData = localStorage.getItem('hasSeenIngredientProductDisclaimer');
        if (disclaimerData) {
            const { expiry } = JSON.parse(disclaimerData);
            if (new Date().getTime() < expiry) {
                return;
            }
        }
        setIsOpen(true);
    }, []);

    const handleAccept = () => {
        if (dontShowAgain) {
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            localStorage.setItem('hasSeenIngredientProductDisclaimer', JSON.stringify({
                value: true,
                expiry: thirtyDaysFromNow.getTime()
            }));
        }
        setIsOpen(false);
    };

    if (process.env.SHOW_DISCLAMER === 'false') {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 md:px-6 py-6 rounded-lg max-h-[90vh] flex flex-col">
                <DialogHeader className="pb-4 border-b">
                    <div className="flex items-center justify-center gap-2">
                        <AlertCircle className="h-5 w-5 text-primary" />
                        <DialogTitle className="text-xl font-semibold">
                            Ingredient & Product Disclaimer
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="py-4 space-y-6 overflow-y-auto">
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                        <h3 className="font-medium text-center text-gray-900 mb-2">Data Sources</h3>
                        <p className="text-sm text-gray-700 mb-3">
                            Our ingredient and product information is sourced from reputable databases:
                        </p>
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2 text-sm bg-white p-2 rounded border border-gray-200">
                                <ExternalLink className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                <span className="font-medium">INCIDecoder:</span>
                                <a href="https://incidecoder.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                                    https://incidecoder.com/
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-sm bg-white p-2 rounded border border-gray-200">
                                <ExternalLink className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                <span className="font-medium">NPRA Malaysia:</span>
                                <a href="https://www.npra.gov.my/index.php/en/informationen/quest-list-of-manufacturers-wholesalers-importers/quest-cosmetic-manufacturer-list.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                                    NPRA Cosmetic Manufacturer List
                                </a>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-base text-gray-700 mt-4">
                        Our skin analysis results require professional medical validation:
                    </p>

                    <div className="grid gap-4">
                        <div className="bg-gray-50 p-4 rounded-md border-l-4 border-amber-400">
                            <h3 className="font-medium text-gray-900 mb-1">Not a Medical Diagnosis</h3>
                            <p className="text-sm text-gray-600">
                                The skin conditions identified by our analyzer are not a definitive medical diagnosis and should not be treated as such. Always consult with a qualified dermatologist before starting any treatment.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md border-l-4 border-blue-400">
                            <h3 className="font-medium text-gray-900 mb-1">Informational Purpose Only</h3>
                            <p className="text-sm text-gray-600">
                                This analysis is provided solely for informational purposes and is not intended to replace professional medical advice, diagnosis, or treatment.
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 text-center italic">
                        While we strive to provide accurate skin analysis, the results should be verified by healthcare professionals for proper diagnosis and treatment recommendations.
                    </p>
                </div>

                <DialogFooter className="flex-col sm:flex-col gap-3 pt-2 border-t">
                    <div className="flex items-center space-x-2 self-center">
                        <Checkbox
                            id="dontShowAgain"
                            checked={dontShowAgain}
                            onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label
                            htmlFor="dontShowAgain"
                            className="text-sm font-medium leading-none text-gray-700"
                        >
                            Don&apos;t show this message again for 30 days
                        </label>
                    </div>

                    <Button
                        onClick={handleAccept}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-md transition-colors"
                    >
                        I Understand and Agree
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default IngredientDisclaimerModal;