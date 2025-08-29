"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ConcernEntity, GoodEntity, ProductEntity } from '../../../entities/product-entity';
import { ConcernBarChart } from '../components/concern-bar-chart';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { checkLocationinDescription, getConfidenceColor, getConfidenceName, removeDuplicateConcerns } from '@/src/core/constant/helper';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from 'react-responsive';
import { AlertCircle, ChevronDown, Microscope, ShoppingBag } from 'lucide-react';
import AnalyzeDetailProductScreen from './analyze-detail-product-screen';
import AnalyzeDetailConcernScreen from './analyze-detail-concern-screen';
import toast from 'react-hot-toast';
import SkinConsultationList from '../components/skin-consultation-list';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import AnalysisImageDialog from '../components/analysis-image-dialog';

const AnalyzeDetailAnalysisScreen = (
    { diseases, good, onProductRecommendation, products
    }: {
        diseases: ConcernEntity[],
        good: GoodEntity[],
        onProductRecommendation: () => void,
        products: ProductEntity[]
    }) => {

    const [showAllConcerns, setShowAllConcerns] = useState(false);

    const uniqueConcerns = diseases.filter((disease, index, self) =>
        index === self.findIndex(t => t.name === disease.name)
    );

    const combine = [...diseases];

    const findIndexStartingZero = combine.sort((a, b) => (b.confidence_percent ?? 0) - (a.confidence_percent ?? 0)).findIndex(disease => disease.confidence_percent === 0);

    const displayCombine = showAllConcerns ? combine : combine.slice(0, findIndexStartingZero);

    // Check if there are items with confidence_percent > 0 that are hidden
    const hasHiddenItems = findIndexStartingZero > 0 && findIndexStartingZero < combine.length;

    const isTabletOrMobile = useMediaQuery({ maxWidth: 1024 });

    const [percentageScroll, setPercentageScroll] = useState(0);
    const [page, setPage] = useState('Analysis');
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const scrollHeight = document.body.scrollHeight;
            const clientHeight = window.innerHeight;
            const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

            // Check which section is currently in view
            const analysisSection = document.querySelector('[data-value="Analysis"]');
            const productsSection = document.querySelector('[data-value="Products"]');
            const concernsSection = document.querySelector('[data-value="Concerns"]');

            // Get positions of each section if they exist
            if (analysisSection && productsSection && concernsSection) {
                const analysisBounds = analysisSection.getBoundingClientRect();
                const productsBounds = productsSection.getBoundingClientRect();
                const concernsBounds = concernsSection.getBoundingClientRect();

                // Determine which section is most visible in the viewport
                if (analysisBounds.top <= clientHeight / 2 && analysisBounds.bottom >= 0) {
                    setPercentageScroll(30);
                    setPage('Analysis');
                }
                if (productsBounds.top <= clientHeight / 2 && productsBounds.bottom >= 0) {
                    setPercentageScroll(70);
                    setPage('Products');

                }
                if (concernsBounds.top <= clientHeight / 2 && concernsBounds.bottom >= 0) {
                    setPercentageScroll(100);
                    setPage('Concerns');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Call once to set initial state
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

    const handleAnalysisOpen = () => {
        setIsAnalysisOpen(true);
    }


    return (
        <div className="flex flex-col items-start justify-center gap-4 w-full relative">



            <div
                data-value="Analysis"
                className="w-full">

                <div className='flex flex-col items-start justify-center gap-4 w-full'>
                    {/* Analysis Tabbar */}
                    <div className='flex flex-col items-start justify-center  w-full'>
                        <p className='text-xl md:text-2xl font-bold'>Skin Analysis</p>
                        <p className='text-sm font-light text-muted-foreground'>List of skin analysis detected</p>
                    </div>

                    {
                        isTabletOrMobile ? (
                            <div className="flex flex-col items-start justify-center gap-4 w-full">
                                {
                                    removeDuplicateConcerns(displayCombine).sort((a, b) => (b.confidence_percent ?? 0) - (a.confidence_percent ?? 0)).map((item, index) => (
                                        <div key={index} className="w-full">
                                            <SkinFeatureCard item={item} />
                                        </div>
                                    ))
                                }
                            </div>
                        ) : (
                            <div className='w-full'>
                                <SkinFeaturesTable
                                    combine={removeDuplicateConcerns(displayCombine)}
                                    setShowAllConcerns={setShowAllConcerns}
                                    showAllConcerns={showAllConcerns}
                                />
                            </div>
                        )
                    }

                    {hasHiddenItems && (
                        <CardFooter className="flex justify-center w-full">
                            <Button
                                variant="outline"
                                onClick={() => setShowAllConcerns(!showAllConcerns)}
                                className="flex items-center gap-2"
                            >
                                {showAllConcerns ? 'Show Less' : 'Show More'}
                                <ChevronDown className={`h-4 w-4 transition-transform ${showAllConcerns ? 'rotate-180' : ''}`} />
                            </Button>
                        </CardFooter>
                    )}

                </div>

                {
                    isTabletOrMobile && (
                        <div className='w-full mt-4'>
                            <SkinConsultationList
                                diseases={uniqueConcerns}
                                onProductRecommendation={onProductRecommendation}
                            />
                        </div>
                    )
                }
            </div>
            {/* Product Tabbar */}
            {
                isTabletOrMobile && (
                    <div
                        data-value="Products"
                        className=" overflow-y-auto"
                        onScroll={(e) => {
                            const element = e.currentTarget;
                            const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;
                            const isAtTop = element.scrollTop === 0;

                            if (isAtBottom) {
                                toast.success('You have reached the end of the page');
                            }
                            if (isAtTop) {
                                toast.success('You have reached the top of products section');
                            }
                        }}
                    >
                        <AnalyzeDetailProductScreen
                            products={products}
                        />
                    </div>
                )
            }

            {/* Concern Tabbar */}
            {
                isTabletOrMobile && (
                    <div
                        data-value="Concerns"
                        className=" overflow-y-auto w-full"
                        onScroll={(e) => {
                            const element = e.currentTarget;
                            const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;
                            const isAtTop = element.scrollTop === 0;
                            toast.success(isAtBottom.toString());
                            if (isAtBottom) {
                                toast.success('You have reached the end of the page');
                            }
                            if (isAtTop) {
                                toast.success('You have reached the top of concerns section');
                            }
                        }}
                    >
                        <AnalyzeDetailConcernScreen
                            concerns={diseases}
                        />
                    </div>
                )
            }
        </div>
    )
}

const SkinFeatureCard = ({ item }: { item: any }) => {

    const calculateWidth = (confidence_percent: number) => {
        return (confidence_percent * 1000) / 10;
    }

    return (
        <AnalysisImageDialog item={item} />
    )






    // return (
    //     <Card className="w-full hover:shadow-md transition-all duration-200  border-red-200">
    //         <CardContent className="p-4">
    //             <div className="space-y-4">
    //                 <div className="flex justify-between items-start">
    //                     <h3 className="font-semibold text-gray-900">{item.name}</h3>

    //                     <img
    //                         src={'/analysis/Single Area (No Combination) 4. Nose.png'}
    //                         alt={item.name}
    //                         className="w-10 h-10 rounded-full"
    //                     />
    //                 </div>

    //                 {item.confidence_percent !== undefined && (
    //                     <div className="space-y-1">
    //                         <div className="flex justify-between items-center">
    //                             <p className="text-sm font-bold ">How Bad It Is</p>
    //                             <div className="flex items-center">
    //                                 <span className="text-xs font-medium text-gray-600">{item.confidence_percent * 100}%</span>
    //                             </div>
    //                         </div>
    //                         <div className="w-full bg-gray-200 rounded-full h-2.5">
    //                             <div
    //                                 className={`h-2.5 rounded-full transition-all`}
    //                                 style={{
    //                                     width: `${calculateWidth(item.confidence_percent)}%`,
    //                                     backgroundColor: '#ff0000'
    //                                 }}
    //                             />
    //                         </div>

    //                         <div className="flex justify-between text-xs text-gray-400 mt-1">
    //                             <span>Mild</span>
    //                             <span>Severe</span>
    //                         </div>
    //                     </div>
    //                 )}

    //                 {item.ai_comment && (
    //                     <div className="flex p-3 bg-gray-50 rounded-lg">
    //                         <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{
    //                             __html: item.ai_comment.toLowerCase().includes('not detected')
    //                                 ? item.ai_comment
    //                                 : item.ai_comment.split(/\b/).map((word: string) => {
    //                                     const trimmedWord = word.trim();
    //                                     return checkLocationinDescription(trimmedWord, item.location || '') &&
    //                                         trimmedWord !== 'and'
    //                                         ? `<span class="font-bold text-red-500">${word}</span>`
    //                                         : word
    //                                 }).join('')
    //                         }} />
    //                     </div>
    //                 )}
    //             </div>
    //         </CardContent>
    //     </Card>
    // )
};

const SkinFeaturesTable = (
    { combine,
        setShowAllConcerns,
        showAllConcerns }:
        {
            combine: any[]
            setShowAllConcerns: (showAllConcerns: boolean) => void,
            showAllConcerns: boolean
        }) => {

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Analysis</TableHead>
                        <TableHead>How Bad It Is</TableHead>
                        <TableHead>Nuuha Skin Analysis</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {combine.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                                <SeveritySlider
                                    confidence_percent={item.confidence_percent}
                                />
                            </TableCell>
                            <TableCell>{item.ai_comment ?? '-'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}

const SeveritySlider = (
    { confidence_percent }: { confidence_percent: number }) => {

    const calculateWidth = (confidence_percent: number) => {
        return (confidence_percent * 1000) / 10;
    }

    const getRedGradient = (confidence: number) => {
        // Convert confidence to 0-100 scale
        const value = confidence * 100;
        // Higher confidence = lighter red, lower confidence = darker red
        const lightness = Math.min(80, 30 + (value / 2)); // Ranges from 30% to 80% lightness
        return `hsl(0, 100%, ${lightness}%)`;
    }

    return (
        <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all`}
                    style={{
                        width: `${calculateWidth(confidence_percent)}%`,
                        backgroundColor: getRedGradient(confidence_percent)
                    }}
                />
            </div>
        </div>
    )
}

export default AnalyzeDetailAnalysisScreen;