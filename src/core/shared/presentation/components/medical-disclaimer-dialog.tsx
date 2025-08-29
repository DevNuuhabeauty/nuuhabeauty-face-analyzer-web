"use client"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MedicalDisclaimerModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const disclaimerData = localStorage.getItem('hasSeenDisclaimer');
        if (disclaimerData) {
            const { expiry } = JSON.parse(disclaimerData);
            if (new Date().getTime() < expiry) {
                return; // Don't show if within 30 days
            }
        }
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleAccept = () => {
        if (dontShowAgain) {
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            localStorage.setItem('hasSeenDisclaimer', JSON.stringify({
                value: true,
                expiry: thirtyDaysFromNow.getTime()
            }));
        }
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] px-4 md:px-6 max-h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-2xl text-center font-bold mb-4 md:mb-2">Important Medical Disclaimer</DialogTitle>
                </DialogHeader>

                <div className="overflow-y-auto flex-grow pr-2">
                    <DialogDescription className="space-y-4 md:space-y-2">
                        <p className="font-semibold text-lg">Informational Purposes Only</p>
                        <p>
                            This skin analysis application is designed for informational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment. The analysis, assessments, and recommendations provided are based on computer vision technology and should be considered as general guidance rather than definitive medical conclusions.
                        </p>

                        <p className="font-semibold text-lg">Medical Advice Notice</p>
                        <ul className="text-left list-disc pl-6 space-y-2">
                            <li>The content provided is not a substitute for professional medical advice, diagnosis, or treatment</li>
                            <li>Always seek the advice of your dermatologist, physician, or other qualified healthcare provider</li>
                            <li>Never disregard professional medical advice or delay seeking it because of information from this application</li>
                        </ul>

                        <p className="font-semibold text-lg">Technology Limitations</p>
                        <ul className="text-left list-disc pl-6 space-y-2">
                            <li>Analysis results may not be 100% accurate</li>
                            <li>Results are based on machine learning models with specific dataset limitations</li>
                            <li>Confidence scores represent algorithmic certainty, not clinical certainty</li>
                        </ul>

                        <p className="font-semibold text-lg">Recommended Actions</p>
                        <ul className="text-left list-disc pl-6 space-y-2">
                            <li>Use this app as a supplementary tool only</li>
                            <li>Consult healthcare professionals before making treatment decisions</li>
                            <li>Seek immediate medical attention for persistent, painful, or concerning conditions</li>
                        </ul>

                        <p className="text-sm mt-4">
                            By using this application, you acknowledge that you have read and understood this disclaimer and agree to use the application at your own risk.
                        </p>
                    </DialogDescription>
                </div>

                <div className="mt-6 md:mt-4 space-y-4 flex-shrink-0">
                    <div className="flex items-center space-x-2 justify-center">
                        <Checkbox
                            id="dontShowAgain"
                            checked={dontShowAgain}
                            onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
                        />
                        <label
                            htmlFor="dontShowAgain"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Don't show this message again
                        </label>
                    </div>
                    <Button onClick={handleAccept} className="w-full">
                        I Understand and Accept
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MedicalDisclaimerModal;