const InfoCard = ({ title, description, type = "success" }: { title?: string, description: string, type?: "success" | "info" | "warning" }) => {
    // Define color schemes based on type
    const colorSchemes = {
        success: {
            bg: "bg-gray-50",
            border: "border-primary",
            text: "text-primary"
        },
        info: {
            bg: "bg-gray-50",
            border: "border-gray-500",
            text: "text-gray-800"
        },
        warning: {
            bg: "bg-amber-50",
            border: "border-amber-500",
            text: "text-amber-800"
        }
    };

    const colors = colorSchemes[type];

    return (
        <div className={`${colors.bg} border-l-4 ${colors.border} p-4 my-4 rounded-lg text-sm`}>
            {title && (
                <div className={`font-medium ${colors.text} mb-1`}>{title}</div>
            )}
            <div className={title ? "" : `font-medium ${colors.text}`}>{description}</div>
        </div>
    );
};

export default InfoCard;

// Usage examples:
// 
// <InfoCard 
//   description="Always verify information obtained from Face Analysis with reliable healthcare professionals."
//   type="success"
// />
//
// <InfoCard 
//   title="Important Note"
//   description="Always verify information obtained from Face Analysis with reliable healthcare professionals."
//   type="info"
// />
//
// <InfoCard 
//   description="Always verify information obtained from Face Analysis with reliable healthcare professionals."
//   type="warning"
// />