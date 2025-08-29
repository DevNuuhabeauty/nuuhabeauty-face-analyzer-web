import DisclaimerModal from "@/src/core/shared/presentation/components/disclaimer-modal";
import InfoScreen from "@/src/core/shared/presentation/components/info-screen";
import MedicalDisclaimerModal from "@/src/core/shared/presentation/components/medical-disclaimer-dialog";
import LoadingScreen from "@/src/core/shared/presentation/view/loading-screen";
import { useGetSingleAnalyze } from "@/src/features/analyzer/presentation/tanstack/face-analyze-tanstack";
import FaceAnalyzeDetailScreen from "@/src/features/analyzer/presentation/view/screen/face-analyze-detail-screen";
import Image from "next/image";

const AnalyzeDetailPage = async (props: { params: Promise<{ analyzerId: string }> }) => {
    const analyzeId = (await props.params).analyzerId;

    if (!analyzeId) {
        return <div>No ID</div>
    }
    return (
        <>
            <FaceAnalyzeDetailScreen
                analyzerId={analyzeId}
            />
            {/* <MedicalDisclaimerModal /> */}
            {/* <DisclaimerModal /> */}
        </>
    )
}

export default AnalyzeDetailPage;
