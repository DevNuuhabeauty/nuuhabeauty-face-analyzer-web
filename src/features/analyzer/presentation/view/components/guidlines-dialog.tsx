"use client"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMediaQuery } from "react-responsive";


export interface GuidelinesDialogProps {
    showGuidelines: boolean;
    setShowGuidelines: (value: boolean) => void;
    startWebcam: () => void;
    loadingCamera: boolean;
}

const GuidelinesDialog = ({
    showGuidelines,
    setShowGuidelines,
    startWebcam,
    loadingCamera
}: GuidelinesDialogProps) => {
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    return (
        <Dialog
            open={showGuidelines}
            onOpenChange={setShowGuidelines}
        >
            <DialogContent className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] px-4 md:px-6 rounded-lg max-h-[90vh] overflow-y-auto">

                <div className="my-4">
                    <img
                        src={isMobile ? "/analyzer_mobile.png" : "/analyzer_desktop.png"}
                        alt="Face Scan Guidelines"
                        className="w-full h-[700px] rounded-lg object-contain"
                    />
                </div>
                <DialogFooter className="flex justify-center mt-6">
                    <Button
                        onClick={startWebcam}
                        className="w-full"
                        disabled={loadingCamera}
                    >
                        {loadingCamera ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start Scan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default GuidelinesDialog;