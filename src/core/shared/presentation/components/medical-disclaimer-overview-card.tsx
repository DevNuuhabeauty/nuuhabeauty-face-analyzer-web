import CitationCard from "./citation-card"

import { Switch } from "@/components/ui/switch";

export interface MedicalDisclaimerOverviewCardProps {
    showMedicalCard: boolean;
    handleShowMedicalCard: () => void;
}

const MedicalDisclaimerOverviewCard = ({ showMedicalCard, handleShowMedicalCard }: MedicalDisclaimerOverviewCardProps) => {
    return (
        <div className="flex flex-col items-start justify-start w-full gap-4">
            <div className="flex flex-row items-center justify-end w-full gap-2 ">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">
                    Medical Disclaimer
                </p>
                <Switch
                    checked={showMedicalCard}
                    onCheckedChange={handleShowMedicalCard} />
            </div>

            {
                showMedicalCard && (
                    <CitationCard
                        title="Medical Disclaimer"
                        description={<>
                            The analysis and ingredient information provided is for educational purposes only, sourced from{' '}
                            <a href="https://incidecoder.com" target="_blank" rel="noopener noreferrer" className="underline">INCIDecoder</a>
                            {' '}and{' '}
                            <a href="https://www.npra.gov.my" target="_blank" rel="noopener noreferrer" className="underline">NPRA Malaysia</a>
                            {' '}under fair use. Product data may not reflect real-time changes. Please consult healthcare professionals for medical advice and refer to original sources for complete information.
                        </>}
                        type="warning"
                    />
                )
            }

        </div>

    )
}

export default MedicalDisclaimerOverviewCard;