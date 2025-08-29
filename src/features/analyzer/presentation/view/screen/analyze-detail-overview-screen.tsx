import { capitalizeFirstLetter, getSkinCondition } from "@/src/core/constant/helper";
import { useMediaQuery } from "react-responsive";
import { AnalysisEntity } from "../../../entities/analysis-entity";
import { ConcernEntity } from "../../../entities/product-entity";
import AnalyzeImageDialog from "../components/analyze-image-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SkinConsultationList from "../components/skin-consultation-list";

const AnalyzeDetailOverviewScreen = ({
    analysis,
    diseases,
    onProductRecommendation
}: {
    analysis: AnalysisEntity,
    diseases: ConcernEntity[],
    onProductRecommendation: () => void
}) => {

    const skinCondition = getSkinCondition(analysis);
    const [showAllDiseases, setShowAllDiseases] = useState(false);

    const uniqueConcerns = diseases.filter((disease, index, self) =>
        index === self.findIndex(t => t.name === disease.name)
    );

    //get disease where ai recommendation is not null or '-'
    const aiDiseases = diseases.filter(disease => disease.ai_comment !== null && disease.ai_comment !== '-');

    const displayedDiseases = showAllDiseases ? aiDiseases : aiDiseases.slice(0, 3);

    const isTabletOrMobile = useMediaQuery({ maxWidth: 1024 });

    for (const disease of aiDiseases) {
        console.log(disease.ai_comment);
    }

    return (
        <div className="flex flex-col gap-4 w-full items-center xl:w-1/3">
            {/* <BuildImage analysis={analysis} removeBackground={analysis.userImage ?? ''} /> */}

            <div className="w-full flex justify-center items-center">
                <AnalyzeImageDialog analysis={analysis} removeBackground={analysis.userImage ?? ''} />
            </div>

            <div className="flex flex-col item-center justify-center gap-2 w-full">

                <div className="flex flex-row items-center justify-between w-full gap-4">
                    <p className="text-xs font-light">
                        Skin Score
                    </p>

                    <p className="text-xs font-bold">
                        {skinCondition.value.toFixed(2)}%
                    </p>
                </div>


                <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all`}
                            style={{
                                width: `${skinCondition.value}%`,
                                backgroundColor: 'hsl(var(--primary))'
                            }}
                        />
                    </div>
                </div>

                <div className="flex flex-row items-center justify-between w-full gap-4">
                    <p className="text-xs font-light">
                        Skin Condition
                    </p>

                    <p className="text-xs font-bold">
                        {capitalizeFirstLetter(analysis.skin_condition || 'N/A')}
                    </p>
                </div>
            </div>


            {
                !isTabletOrMobile && (
                    <div className="w-full mt-4">
                        <SkinConsultationList
                            diseases={diseases}
                            onProductRecommendation={onProductRecommendation}
                        />
                    </div>
                )
            }
        </div>
    )
}

export default AnalyzeDetailOverviewScreen;