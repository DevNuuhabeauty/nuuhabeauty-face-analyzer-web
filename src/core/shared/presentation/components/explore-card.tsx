import React from 'react';
import Image from 'next/image';

export interface ExploreCardProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    image: string;
    color?: string;
    onClick: () => void;
}

const ExploreCard = ({
    title,
    description,
    image,
    color,
    onClick }: ExploreCardProps) => {
    return (
        <div
            onClick={onClick}
            className={`flex flex-col items-start w-[150px] ${color} p-4 rounded-3xl border border-gray-200 h-[150px]`}
        >
            <div className='flex flex-row items-end justify-end w-full h-[50px]'>
                <Image
                    src={image}
                    alt={title}
                    width={50}
                    height={50}
                    className="object-contain"
                />
            </div>

            <div className='flex flex-col items-start justify-start w-full mt-auto'>
                <h3 className='text-md font-bold text-gray-800'>{title}</h3>
                <p className='text-gray-600 text-xs leading-tight'>{description}</p>
            </div>
        </div>
    );
};

export default ExploreCard;