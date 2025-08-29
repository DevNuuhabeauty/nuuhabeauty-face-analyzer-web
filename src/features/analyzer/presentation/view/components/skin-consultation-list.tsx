import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Heart, Info, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SkinConsultationList = ({ diseases, onProductRecommendation }: { diseases: any[], onProductRecommendation: () => void }) => {
    const [showAllDiseases, setShowAllDiseases] = useState(false);

    // Filter diseases where confidence_percent is greater than 0
    const filteredDiseases = diseases.filter(disease => disease.confidence_percent > 0);
    const displayedDiseases = showAllDiseases ? filteredDiseases : filteredDiseases.slice(0, 3);

    const isMobile = useMediaQuery({ maxWidth: 768 });

    useEffect(() => {
        for (const disease of diseases) {
            console.log('disease', disease);
        }
    }, [diseases]);

    return (
        <div className="flex flex-col gap-4 items-start w-full">
            <div className="flex flex-row items-center justify-between w-full">
                <p className="text-lg font-bold leading-relaxed text-left">
                    Nuuha Skin Consultation
                </p>
                {/* <div
                    onClick={onProductRecommendation}
                >
                    <p className="text-xs font-light text-gray-500 text-right hover:underline cursor-pointer">
                        See Product Recommendations
                    </p>
                </div> */}
            </div>

            {displayedDiseases.map((disease: any, index: number) => (
                <div
                    key={index}
                    className="w-full">
                    <SkinConsultationCard disease={disease} />
                </div>
            ))}

            <div className="w-full flex justify-center mt-2">
                <Button
                    variant="outline"
                    onClick={() => setShowAllDiseases(!showAllDiseases)}
                >
                    {showAllDiseases ? 'Show Less' : `Show More`}
                </Button>
            </div>
        </div>
    )
}

const SkinConsultationCard = ({ disease }: { disease: any }) => {
    return (
        <Card className="w-full overflow-hidden border border-gray-200 hover:border-blue-200 transition-all duration-200">
            <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-gray-900">{disease.name}</h3>
                    </div>
                    {/* <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary" />
                    </div> */}
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5 text-gray-400" />
                        What To Do?
                    </p>
                    <p className="text-sm leading-relaxed font-light">
                        {disease.how_to_use || disease.ai_comment || 'No suggestion available'}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

const SeverityBadge = ({ severity }: { severity: string }) => {
    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'mild':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'moderate':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'severe':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    return (
        <Badge className={`rounded-full px-2 py-1 text-xs font-medium ${getSeverityColor(severity)}`}>
            {severity}
        </Badge>
    );
};

const SkinConsultationListMobile = ({ diseases, onProductRecommendation, setShowAllDiseases, showAllDiseases }: { diseases: any[], onProductRecommendation: () => void, setShowAllDiseases: (showAllDiseases: boolean) => void, showAllDiseases: boolean }) => {
    return (
        <div className="flex flex-col gap-4 items-start w-full">
            <div className="flex flex-row items-center justify-between w-full">
                <p className="text-lg font-bold leading-relaxed text-left">
                    Nuuha Skin Consultation
                </p>
                <div
                    onClick={onProductRecommendation}
                >
                    <p className="text-xs font-light text-gray-500 text-right hover:underline cursor-pointer">
                        See Product Recommendations
                    </p>
                </div>
            </div>

            {diseases.map((disease: any, index: number) => (
                <div key={index} className="flex flex-col p-4 rounded-lg shadow-sm border gap-2 w-full">
                    <div className="flex flex-col items-start justify-center flex-1">
                        <p className="text-xs font-bold leading-relaxed text-left">
                            Name
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed text-left">
                            {disease.ai_comment || 'No recommendation available'}
                        </p>
                    </div>

                    <div className="flex flex-col items-start justify-center flex-1">
                        <p className="text-xs font-bold leading-relaxed">
                            How to use
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            {disease.ai_comment || 'No recommendation available'}
                        </p>
                    </div>
                </div>
            ))}

            <div className="w-full flex justify-center mt-2">
                <Button
                    variant="outline"
                    onClick={() => setShowAllDiseases(!showAllDiseases)}
                >
                    {showAllDiseases ? 'Show Less' : `Show More (${diseases.length} more)`}
                </Button>
            </div>
        </div>
    )
}

const SkinConsultationListDesktop = ({ diseases, onProductRecommendation, setShowAllDiseases, showAllDiseases }: { diseases: any[], onProductRecommendation: () => void, setShowAllDiseases: (showAllDiseases: boolean) => void, showAllDiseases: boolean }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex flex-row items-center justify-between w-full gap-4">
                    <h3 className="text-lg font-bold text-gray-800">
                        Nuuha Skin Consultation
                    </h3>

                    <div
                        onClick={onProductRecommendation}
                    >
                        <p className="text-xs font-light text-gray-500 text-right hover:underline cursor-pointer">
                            See Product Recommendations
                        </p>
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent>
                {diseases.length == 0 && (
                    <div className="flex flex-col gap-4 w-full">
                        <p className="text-xs font-light text-gray-500 text-center">
                            No skin concerns detected
                        </p>
                    </div>
                )}

                {diseases.length > 0 && (
                    <div className="flex flex-col gap-4 w-full">
                        {diseases.map((disease: any, index: number) => (
                            <div key={index} className="flex flex-col p-4 rounded-lg shadow-sm border gap-2">
                                <div className="flex flex-col items-start justify-center flex-1">
                                    <p className="text-xs font-bold leading-relaxed text-left">
                                        Name
                                    </p>
                                    <p className="text-xs text-gray-600 leading-relaxed text-left">
                                        {disease.ai_comment || 'No recommendation available'}
                                    </p>
                                </div>

                                <div className="flex flex-col items-start justify-center flex-1">
                                    <p className="text-xs font-bold leading-relaxed">
                                        How to use
                                    </p>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        {disease.ai_comment || 'No recommendation available'}
                                    </p>
                                </div>
                            </div>
                        ))}

                        <div className="w-full flex justify-center mt-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowAllDiseases(!showAllDiseases)}
                            >
                                {showAllDiseases ? 'Show Less' : `Show More (${diseases.length} more)`}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default SkinConsultationList;