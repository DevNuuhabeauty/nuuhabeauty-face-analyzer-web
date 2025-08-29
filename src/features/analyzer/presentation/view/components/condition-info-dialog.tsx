import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InfoIcon } from "lucide-react";

const ConditionInfoDialog = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex flex-row items-center justify-center gap-2">
                    <p className="text-xs font-light hover:underline">Condition Info</p>
                    <InfoIcon className="w-4 h-4" />
                </div>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] px-4 md:px-6">

                <DialogTitle>Understanding Your Skin Analysis</DialogTitle>
                <div className="space-y-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="font-semibold">What is Concern Detection?</h3>
                            <p className="text-sm text-gray-600">
                                Our AI system analyzes your skin images to identify potential skin conditions and concerns. Each detected condition is listed with its corresponding confidence level.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold">Confidence Levels Explained</h3>
                            <p className="text-sm text-gray-600">
                                The confidence level represents how certain our AI system is about detecting a particular condition. Higher percentages indicate stronger detection signals.
                            </p>

                            <div className="space-y-2">
                                <div className="flex flex-row items-center justify-between w-full gap-4">
                                    <p className="text-sm font-light">
                                        0.1 - 0.3
                                    </p>
                                    <p className="text-sm font-bold">
                                        Low
                                    </p>
                                </div>

                                <div className="flex flex-row items-center justify-between w-full gap-4">
                                    <p className="text-sm font-light">
                                        0.3 - 0.7
                                    </p>
                                    <p className="text-sm font-bold">
                                        Medium
                                    </p>
                                </div>

                                <div className="flex flex-row items-center justify-between w-full gap-4">
                                    <p className="text-sm font-light">
                                        0.7 - 1
                                    </p>
                                    <p className="text-sm font-bold">
                                        High
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold">How to Interpret Results</h3>
                            <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
                                <li>Multiple conditions may be detected in a single analysis</li>
                                <li>Results are meant to be informative, not diagnostic</li>
                                <li>Always consult healthcare professionals for medical advice</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConditionInfoDialog;