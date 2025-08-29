"use client"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const DisclaimerModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const pathname = usePathname();

    const handleAccept = () => {
        // if (dontShowAgain) {
        //     const sevenDaysFromNow = new Date();
        //     sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        //     localStorage.setItem('hasSeenDisclaimerChild', JSON.stringify({
        //         value: true,
        //         expiry: sevenDaysFromNow.getTime()
        //     }));
        // }
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        localStorage.setItem('hasSeenDisclaimerChild', JSON.stringify({
            value: true,
            expiry: sevenDaysFromNow.getTime()
        }));

        onClose();
    };

    useEffect(() => {
        const hasSeenDisclaimerChild = localStorage.getItem('hasSeenDisclaimerChild');
        if (hasSeenDisclaimerChild && JSON.parse(hasSeenDisclaimerChild).expiry < Date.now()) {
            onClose();
        }
    }, []);

    useEffect(() => {
        // const hasSeenDisclaimerChild = localStorage.getItem('hasSeenDisclaimerChild');
        // if (hasSeenDisclaimerChild) {
        //     onClose();
        // }
        const hasSeenDisclaimerChild = localStorage.getItem('hasSeenDisclaimerChild');

        console.log('hasSeenDisclaimerChild', hasSeenDisclaimerChild);
    }, []);



    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] px-4 md:px-6 rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center font-bold mb-4 md:mb-2">Online Safety Reminder</DialogTitle>
                    <DialogDescription className="space-y-4 md:space-y-2">
                        <div className="font-semibold text-lg text-center">Important Safety Information for Young Users</div>
                        <div className="text-center">
                            Before you continue, please read these important safety guidelines:
                        </div>
                        <ul className="text-left list-disc pl-6 space-y-2">
                            <li>Never share personal information like your full name, address, phone number, or school name with people you meet online</li>
                            <li>Be careful about sharing photos or videos of yourself</li>
                            <li>If someone makes you feel uncomfortable, tell a parent or trusted adult right away</li>
                            <li>Remember that people online may not be who they claim to be</li>
                            <li>Think carefully before posting or sending any messages</li>
                        </ul>
                        <div className="mt-4 font-medium text-center">
                            For users under 13: Parent/guardian permission is required to use social features. Parents can manage social feature settings in the account settings.
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-6 md:mt-4 space-y-4">
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
                        I Understand and Will Be Safe Online
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DisclaimerModal;