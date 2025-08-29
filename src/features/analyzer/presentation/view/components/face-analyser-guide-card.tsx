import { Smartphone } from "lucide-react"

const FaceAnalyserGuideCard = ({
    title,
    description,
    icon
}: {
    title: string
    description: string
    icon: React.ReactNode
}) => {
    return (
        <div className='flex flex-row items-center justify-center gap-4'>

            {icon}
            <div className='flex flex-col items-start justify-center'>
                <p className='text-sm font-bold'>
                    {title}
                </p>
                <p className='text-xs text-muted-foreground'>
                    {description}
                </p>
            </div>

        </div>
    )
}

export default FaceAnalyserGuideCard