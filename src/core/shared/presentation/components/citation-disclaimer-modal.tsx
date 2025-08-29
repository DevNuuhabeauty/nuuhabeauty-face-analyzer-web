import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose,
    DialogFooter
} from "@/components/ui/dialog";
import { ExternalLink, Info, X } from "lucide-react";
import { useState, useEffect } from "react";
import InfoCard from "./info-card";

const CitationDisclaimerModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const handleAccept = () => {
        if (dontShowAgain) {
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            localStorage.setItem('hasSeenDisclaimer', JSON.stringify({
                value: true,
                expiry: thirtyDaysFromNow.getTime()
            }));
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] px-4 md:px-6 max-h-[90vh] flex flex-col rounded-lg">
                <DialogHeader className="pb-4 border-b">
                    <div className="flex items-center justify-center gap-2">
                        <Info className="h-5 w-5 text-primary" />
                        <DialogTitle className="text-xl font-semibold">
                            Citation & Data Usage Disclaimer
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="py-4 space-y-5 overflow-y-auto">
                    <p className="text-sm text-gray-700">
                        We use data from reputable sources to provide accurate ingredient and product information. Please review how we use this information:
                    </p>

                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                            <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                <ExternalLink className="h-4 w-4 text-blue-500" />
                                INCIDecoder Citation Policy
                            </h3>
                            <p className="text-sm text-gray-700">
                                Our ingredient descriptions, functions, and safety ratings may include content adapted from INCIDecoder under fair use principles. We provide this information for educational purposes while maintaining attribution to the original source.
                            </p>
                            <div className="mt-3 bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-600">
                                    <span className="font-medium">Source:</span> <a href="https://incidecoder.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://incidecoder.com/</a>
                                </p>
                                <p className="text-xs text-gray-500 mt-1 italic">
                                    For comprehensive and updated information, please refer to the original INCIDecoder database.
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                            <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                <ExternalLink className="h-4 w-4 text-blue-500" />
                                NPRA Malaysia Citation Policy
                            </h3>
                            <p className="text-sm text-gray-700">
                                Product registration status and manufacturer information referenced from the National Pharmaceutical Regulatory Agency (NPRA) Malaysia is provided for verification purposes only. Our database is periodically updated but may not reflect real-time changes.
                            </p>
                            <div className="mt-3 bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-600">
                                    <span className="font-medium">Source:</span> <a href="https://www.npra.gov.my/index.php/en/informationen/quest-list-of-manufacturers-wholesalers-importers/quest-cosmetic-manufacturer-list.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">NPRA Cosmetic Manufacturer List</a>
                                </p>
                                <p className="text-xs text-gray-500 mt-1 italic">
                                    For official verification of cosmetic products, please consult the NPRA official website.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md border-l-4 border-amber-400">
                        <h3 className="font-medium text-gray-900 mb-1">Fair Use Statement</h3>
                        <p className="text-sm text-gray-600">
                            Information from these sources is used under fair use principles for educational and informational purposes. We make every effort to properly attribute content and encourage users to reference original sources for complete information.
                        </p>
                    </div>

                    <p className="text-sm text-gray-500 text-center italic">
                        We strive to provide accurate information and proper attribution. If you have concerns about our citation practices, please contact us.
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
                        I Understand
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};

export default CitationDisclaimerModal;