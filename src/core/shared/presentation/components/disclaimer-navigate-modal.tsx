"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useState } from "react";

interface DisclaimerNavigateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    children: React.ReactNode;
}

const DisclaimerNavigateModal = ({ isOpen, onClose, onConfirm, children }: DisclaimerNavigateModalProps) => {
    return (
        <Dialog >
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] px-4 md:px-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Leaving the App</DialogTitle>
                    <DialogDescription className="mt-2">
                        You are about to leave our app and visit an external website. Please note that external sites have their own privacy policies and terms of service.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 mt-4">

                    <DialogClose asChild>
                        <Button
                            className="w-full"
                            variant="outline">
                            Cancel
                        </Button>

                    </DialogClose>
                    <Button
                        className="w-full"
                        onClick={onConfirm}>
                        Continue
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DisclaimerNavigateModal;