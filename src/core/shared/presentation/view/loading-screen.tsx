import { Riple } from "react-loading-indicators";
import ShinyText from "../components/shiny-text";

const LoadingScreen = ({
    text,
    subText
}: {
    text: string
    subText: string
}) => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col items-center justify-center gap-4">
                <Riple color="orange" size="large" />
                <div className="space-y-2 text-center">
                    <p className="text-lg">{text}</p>
                    <ShinyText text={subText} disabled={false} speed={5} />
                </div>
            </div>
        </div>
    )
}

export default LoadingScreen;