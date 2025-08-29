import { ConcernEntity } from "../../../entities/product-entity";
import ConcernChip from "../components/concern-chip";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ConcernBarChart } from "../components/concern-bar-chart";
import { useState } from "react";
import ConditionInfoDialog from "../components/condition-info-dialog";
import { getConfidenceColor } from "@/src/core/constant/helper";

const AnalyzeDetailConcernScreen = ({ concerns }: { concerns: ConcernEntity[] }) => {

    const [showAllConcerns, setShowAllConcerns] = useState(false);

    const uniqueConcerns = concerns.filter((concern, index, self) =>
        index === self.findIndex(t => t.name === concern.name)
    );

    const displayedConcerns = showAllConcerns ? uniqueConcerns : uniqueConcerns.slice(0, 5);

    return (
        <div className="flex flex-col items-start justify-center h-full w-full">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Concern Overview</CardTitle>
                    {/* <CardDescription>Confidence levels for detected skin conditions</CardDescription> */}
                </CardHeader>
                <CardContent>
                    <ConcernBarChart diseases={displayedConcerns} />
                </CardContent>
            </Card>

            {/* 
            <div className="flex flex-col items-start justify-center gap-1 w-full mt-8">
                <div className="flex flex-row items-center justify-between w-full gap-4">
                    <p className="text-md font-bold">
                        Concerns
                    </p>

                    <ConditionInfoDialog />
                </div>

                <div className="border p-4 rounded-xl w-full">
                    <div className="flex flex-col items-center w-full gap-4">
                        {
                            concerns.map((concern: ConcernEntity, index: number) => (
                                <div key={index} className="flex flex-row items-center justify-between w-full gap-4">
                                    <p className="text-sm font-light">
                                        {concern.name || 'N/A'}
                                    </p>
                                    <p className={`text-sm font-bold ${getConfidenceColor(concern.confidence_percent || 0)}`}>
                                        {concern.confidence_percent?.toString() || 'N/A'}
                                    </p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default AnalyzeDetailConcernScreen;  