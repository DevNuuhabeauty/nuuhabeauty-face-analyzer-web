"use client"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import toast from "react-hot-toast";

const DefaultAccordian = ({ children, title, }: { children: ReactNode, title: string }) => {

    const [openItem, setOpenItem] = useState<boolean>(true);

    const toggleItem = () => {
        setOpenItem(!openItem);
    };

    return (
        <div
            onClick={() => toggleItem()}
            className="flex flex-col gap-2  rounded-lg w-full">


            <div className="flex justify-between items-center w-full">
                <p className="text-base font-bold">
                    {title}
                </p>

                {/* {openItem ? (
                    <ChevronUpIcon

                        className="w-4 h-4 text-gray-500" />
                ) : (
                    <ChevronDownIcon

                        className="w-4 h-4 text-gray-500" />
                )} */}
            </div>

            {/* {openItem && (
                <div className="flex flex-col gap-2 mt-2">
                    {children}
                </div>
            )} */}

            <div>
                {children}
            </div>

        </div>
    )
}

export default DefaultAccordian;