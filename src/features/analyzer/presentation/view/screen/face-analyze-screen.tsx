'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, BookOpen, Camera, CameraOff, DollarSign, Info, Loader2, Notebook, Sparkles } from 'lucide-react';
import { CONCERN_API_URL } from '@/src/core/constant';


import { toast } from 'react-hot-toast';
import DefaultHeader from '@/src/core/shared/presentation/components/default-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Riple } from 'react-loading-indicators';
import { useAnalyzeSkinMutation } from '../../tanstack/face-analyze-tanstack';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import CredentialDialog from '@/src/features/auth/screen/view/components/credential-dialog';
import InfoScreen from '@/src/core/shared/presentation/components/info-screen';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMediaQuery } from 'react-responsive';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import CitationDisclaimerText from '@/src/core/shared/presentation/components/citation-disclaimer-text';
import CitationDisclaimerModal from '@/src/core/shared/presentation/components/citation-disclaimer-modal';
import DisclaimerModal from '@/src/core/shared/presentation/components/disclaimer-modal';


interface FaceMesh {
    close(): void;
    onResults(listener: (results: Results) => void): void;
    send(config: { image: HTMLVideoElement }): Promise<void>;
    setOptions(config: FaceMeshOptions): void;
}

interface FaceMeshOptions {
    maxNumFaces: number;
    refineLandmarks: boolean;
    minDetectionConfidence: number;
    minTrackingConfidence: number;
}

interface FaceLandmark {
    x: number;
    y: number;
    z: number;
}

interface Results {
    image: HTMLCanvasElement;
    multiFaceLandmarks?: FaceLandmark[][];
}


interface AcneResults {
    visualization: string;
    predictions: any;
}

const FaceMeshDetection = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isWebcamOn, setIsWebcamOn] = useState<boolean>(false);
    const [faceMeshDetector, setFaceMeshDetector] = useState<FaceMesh | null>(null);
    const scanProgressRef = useRef<number>(0);
    const scanPassRef = useRef<number>(1);
    const animationFrameRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(performance.now());
    const [faceDistance, setFaceDistance] = useState<number | null>(null);
    const [headTiltAngle, setHeadTiltAngle] = useState<number | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [acneResults, setAcneResults] = useState<AcneResults | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    //Steps
    const [steps, setSteps] = useState<any[]>([]);
    const [showingSteps, setShowingSteps] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [scanLinePosition, setScanLinePosition] = useState<number>(0);
    const [imageProcessing, setImageProcessing] = useState<string | null>(null);
    const [isStepLoading, setIsStepLoading] = useState<boolean>(false);

    const [showGuidelines, setShowGuidelines] = useState<boolean>(false);
    const [loadingCamera, setLoadingCamera] = useState<boolean>(false);


    const analyzeMutation = useAnalyzeSkinMutation();

    const router = useRouter();


    const { data: session } = useSession();

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const [isCitationOpen, setIsCitationOpen] = useState(false);

    const [showSafetyDisclaimer, setShowSafetyDisclaimer] = useState(true);
    const [showCitationDisclaimer, setShowCitationDisclaimer] = useState(false);

    useEffect(() => {
        console.log("isMobile", isMobile);
    }, [isMobile]);

    // Face contour indices for scanning - increased number of points for better coverage
    const FACE_CONTOUR_INDICES = [
        10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
        397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
        172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109,
        // Additional points for better facial coverage
        151, 337, 299, 333, 298, 301, 368, 264, 447, 366, 401, 435,
        367, 364, 394, 395, 369, 396, 175, 171, 140, 170, 169, 135,
        138, 215, 177, 137, 227, 34, 139, 71, 68, 104, 69, 108
    ];





    useEffect(() => {
        const loadFaceMesh = async () => {
            try {
                const { FaceMesh } = await import('@mediapipe/face_mesh');
                const faceMesh = new FaceMesh({
                    locateFile: (file: string) => {
                        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
                    }
                });

                faceMesh.setOptions({
                    maxNumFaces: 1,
                    refineLandmarks: true,
                    minDetectionConfidence: 0.6, // Increased confidence threshold
                    minTrackingConfidence: 0.6  // Increased tracking confidence
                });


                faceMesh.onResults((results: any) => {

                    const canvas = document.createElement('canvas');
                    canvas.width = results.image.width;
                    canvas.height = results.image.height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(results.image, 0, 0);
                    }

                    onResults({
                        image: canvas,
                        multiFaceLandmarks: results.multiFaceLandmarks
                    });
                });

                setFaceMeshDetector(faceMesh as unknown as FaceMesh);
            } catch (error) {
                console.error('Error loading FaceMesh:', error);
            }
        };

        loadFaceMesh();

        return () => {
            if (faceMeshDetector) {
                faceMeshDetector.close();
            }
        };
    }, []);

    const startWebcam = async () => {


        setShowGuidelines(false);

        if (acneResults) {
            cleanUp();
            return;
        }

        try {

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Camera access is not supported in this browser.");
            }

            console.log('navigator.mediaDevices', navigator.mediaDevices);
            // Get list of available video devices
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            // Detect if running on mobile
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            // Adjust video constraints based on device type
            const videoConstraints = {
                width: isMobile ? { ideal: 1280 } : { ideal: 2560 }, // Lower resolution for mobile
                height: isMobile ? { ideal: 720 } : { ideal: 1440 }, // Lower resolution for mobile
                facingMode: 'user',
                deviceId: videoDevices.length > 0 ? { ideal: videoDevices[0].deviceId } : undefined,
                // Adjust advanced settings for mobile vs desktop
                advanced: isMobile ? [
                    { width: { min: 640, ideal: 1280, max: 1920 } },
                    { height: { min: 480, ideal: 720, max: 1080 } },
                    { frameRate: { ideal: 30 } } // Lower frame rate for mobile
                ] : [
                    { width: { min: 1920, ideal: 2560, max: 3840 } },
                    { height: { min: 1080, ideal: 1440, max: 2160 } },
                    { frameRate: { ideal: 60 } }
                ]
            };

            const stream = await navigator.mediaDevices.getUserMedia({
                video: videoConstraints
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    const videoTrack = stream.getVideoTracks()[0];
                    const settings = videoTrack.getSettings();
                    console.log('Camera settings:', settings);

                    // Set appropriate dimensions based on device
                    const width = isMobile ? (settings.width || 1280) : (settings.width || 2560);
                    const height = isMobile ? (settings.height || 720) : (settings.height || 1440);

                    if (videoRef.current && canvasRef.current) {
                        videoRef.current.width = width;
                        videoRef.current.height = height;
                        canvasRef.current.width = width;
                        canvasRef.current.height = height;
                    }
                    setIsWebcamOn(true);
                    scanProgressRef.current = 0;
                    scanPassRef.current = 1;
                };
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoadingCamera(false);
        }

    };

    const stopWebcam = () => {
        if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsWebcamOn(false);
        }
    };

    const getContourPoints = (landmarks: FaceLandmark[], canvasWidth: number, canvasHeight: number) => {
        return FACE_CONTOUR_INDICES.map(index => {
            const point = landmarks[index];
            return {
                x: point.x * canvasWidth,
                y: point.y * canvasHeight
            };
        });
    };

    const findIntersections = (points: { x: number; y: number; }[], yLevel: number) => {
        const intersections = [];

        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];

            if ((p1.y <= yLevel && p2.y >= yLevel) || (p2.y <= yLevel && p1.y >= yLevel)) {
                if (p2.y - p1.y !== 0) {
                    const x = p1.x + (p2.x - p1.x) * (yLevel - p1.y) / (p2.y - p1.y);
                    intersections.push(x);
                }
            }
        }

        return intersections.sort((a, b) => a - b);
    };

    const drawScanLine = (ctx: CanvasRenderingContext2D, x1: number, x2: number, y: number, pass: number) => {
        // Use white color for both passes with increased intensity
        const color = '#FFFFFF';

        ctx.shadowColor = color;
        ctx.shadowBlur = 15; // Increased blur
        ctx.strokeStyle = color;
        ctx.lineWidth = 3; // Increased line width

        // Draw multiple lines for stronger glow effect
        for (let i = -3; i <= 3; i++) { // Increased range
            ctx.beginPath();
            ctx.moveTo(x1, y + i);
            ctx.lineTo(x2, y + i);
            ctx.stroke();
        }

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    };

    const calculateFaceDistance = (landmarks: FaceLandmark[]) => {
        const noseTip = landmarks[1];
        const distanceInCm = Math.round(-noseTip.z * 100) / 10;
        return distanceInCm;
    };

    const calculateHeadTilt = (landmarks: FaceLandmark[]) => {
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];

        const deltaY = (rightEye.y - leftEye.y) * canvasRef.current!.height;
        const deltaX = (rightEye.x - leftEye.x) * canvasRef.current!.width;
        const angleRad = Math.atan2(deltaY, deltaX);
        const angleDeg = angleRad * (180 / Math.PI);

        return Math.round(angleDeg * 10) / 10;
    };


    const getProcessingSteps = async (imageData: string) => {
        setImageProcessing(imageData);
        setIsStepLoading(true);
        try {
            const response = await axios.post(`${CONCERN_API_URL}/api/analyze-face-steps`, {
                image: imageData
            }, { headers: { 'Content-Type': 'application/json' } });

            if (response.status !== 200) throw new Error(`HTTP error! status: ${response.status}`);

            const data = response.data.data;

            if (response.status === 200 && data) {
                console.log("Received steps:", data);
                const sortedSteps = data.sort((a: any, b: any) => a.index - b.index);
                setSteps(sortedSteps);
                setShowingSteps(true);
                setCurrentStep(0);
                setScanLinePosition(0);
            } else {
                throw new Error("Invalid response format with status: " + response.status);
            }
        } catch (err) {
            console.error("Error getting steps:", err);
        } finally {
            setIsStepLoading(false);
        }
    }

    const handleAnalyzeCompleted = async (imageData: string) => {
        toast.success("Analyzing your face...");

        analyzeMutation.mutate(
            { imageData },
            {
                onSuccess: (response) => {
                    if (!response) {
                        toast.error('Failed to analyze your face - no analysis ID returned');
                        return;
                    }
                    toast.success('Successfully Scanned');
                    router.push(`/face-analyzer/${response.analyzeId}`);
                },
                onError: (error: Error) => {
                    console.error('Analysis Error:', error);
                    toast.error(error.message);
                },
                onSettled(data, error, variables, context) {
                    setIsStepLoading(false);
                    setIsProcessing(false);
                },
            }
        );
    }


    const processRemoveBackground = async (base64Image: string): Promise<string> => {
        try {
            const response = await axios.post(`${CONCERN_API_URL}/api/remove-background`, {
                image: base64Image
            });

            if (response.status === 200) {
                const data = response.data;
                return data.data;
            } else {
                throw new Error('Failed to process image');
            }
        } catch (error) {
            console.error('Error processing image:', error);
            throw error;
        }
    }

    const processImageForAcne = async (base64Image: string) => {
        try {
            setIsProcessing(true);

            const base64Data = base64Image.split(',')[1];

            const [removeBackgroundImage, _] = await Promise.all([
                processRemoveBackground(base64Data),
                getProcessingSteps(base64Data)
            ]);

            const { data: acneResponse } = await axios.post(`${CONCERN_API_URL}/api/detect-acne`, {
                image: removeBackgroundImage.split(',')[1]
            });

            if (!acneResponse) {
                throw new Error('Failed to process image');
            }

            await handleAnalyzeCompleted(acneResponse.data.visualization);

            setAcneResults({
                visualization: acneResponse.data.visualization,
                predictions: acneResponse.data.predictions
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            toast.error(`Error processing image: ${errorMessage}`);
            console.error('Error processing image:', error);
        }
    };

    const onResults = (results: Results) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        //is mobile device 1.9 and 2.0
        const minDistance = isMobile ? 1.9 : 0.8;
        const maxDistance = isMobile ? 2.0 : 0.9;

        if (results.multiFaceLandmarks && results.multiFaceLandmarks[0]) {
            const landmarks = results.multiFaceLandmarks[0];
            const distance = calculateFaceDistance(landmarks);
            const tiltAngle = calculateHeadTilt(landmarks);
            setFaceDistance(distance);
            setHeadTiltAngle(tiltAngle);

            const contourPoints = getContourPoints(landmarks, canvas.width, canvas.height);

            const minY = Math.min(...contourPoints.map(p => p.y));
            const maxY = Math.max(...contourPoints.map(p => p.y));

            const isCorrectPosition = distance >= minDistance && distance <= maxDistance &&
                tiltAngle >= -6 && tiltAngle <= 6;

            if (isCorrectPosition) {
                const now = performance.now();
                const deltaTime = (now - lastTimeRef.current) / 1000;
                lastTimeRef.current = now;

                if (scanPassRef.current <= 2) {
                    scanProgressRef.current += deltaTime * 0.5;

                    if (scanProgressRef.current > 1) {
                        scanProgressRef.current = 0;
                        scanPassRef.current += 1;
                    }
                }

                const scanRange = maxY - minY;
                const currentY = minY + (scanRange * scanProgressRef.current);

                if (scanPassRef.current === 1 || scanPassRef.current === 2) {
                    const intersections = findIntersections(contourPoints, currentY);
                    if (intersections.length >= 2) {
                        drawScanLine(ctx, intersections[0], intersections[intersections.length - 1], currentY, scanPassRef.current);
                    }
                }

                if (scanPassRef.current === 2) {
                    ctx.fillStyle = '#FFFFFF';
                    for (const landmark of landmarks) {
                        const x = landmark.x * canvas.width;
                        const y = landmark.y * canvas.height;

                        if (y <= currentY) {
                            ctx.beginPath();
                            ctx.arc(x, y, 2, 0, 2 * Math.PI);
                            ctx.fill();
                        }
                    }
                } else if (scanPassRef.current > 2) {
                    if (canvasRef.current) {
                        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.95);
                        setCapturedImage(dataUrl);
                        processImageForAcne(dataUrl);
                    }

                    ctx.fillStyle = '#FFFFFF';
                    for (const landmark of landmarks) {
                        const x = landmark.x * canvas.width;
                        const y = landmark.y * canvas.height;
                        ctx.beginPath();
                        ctx.arc(x, y, 2, 0, 2 * Math.PI);
                        ctx.fill();
                    }

                    stopWebcam();
                }
            } else {
                scanProgressRef.current = 0;
                scanPassRef.current = 1;
            }
        } else {
            setFaceDistance(null);
            setHeadTiltAngle(null);
        }

        ctx.restore();
    };

    useEffect(() => {
        let animationFrame: number;

        const detectFaceMesh = async () => {
            if (!faceMeshDetector || !videoRef.current || !isWebcamOn) return;

            if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                try {
                    await faceMeshDetector.send({ image: videoRef.current });
                } catch (error) {
                    console.error('Error in face detection:', error);
                }
            }
            animationFrame = requestAnimationFrame(detectFaceMesh);
        };

        if (isWebcamOn) {
            detectFaceMesh();
        }

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [faceMeshDetector, isWebcamOn]);


    useEffect(() => {
        if (steps.length > 0 && currentStep < steps.length - 1) {
            setScanLinePosition(0);

            const scanInterval = setInterval(() => {
                setScanLinePosition(prev => {
                    if (prev >= 100) {
                        clearInterval(scanInterval);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 20);

            const timer = setTimeout(() => {
                setCurrentStep(prev => {
                    const nextStep = prev + 1;
                    if (nextStep >= steps.length || nextStep === steps.length - 1) {
                        return 0;
                    }
                    return nextStep;
                });
            }, 1500);

            return () => {
                clearTimeout(timer);
                clearInterval(scanInterval);
            };
        }
    }, [steps, currentStep]);


    const cleanUp = () => {
        setIsProcessing(false);
        setCapturedImage(null);
        setAcneResults(null);
        stopWebcam();
        setFaceDistance(null);
        setHeadTiltAngle(null);
        scanProgressRef.current = 0;
        scanPassRef.current = 1;
        lastTimeRef.current = performance.now();
        faceMeshDetector?.close();
        setFaceMeshDetector(null);
        cancelAnimationFrame(animationFrameRef.current || 0);
        animationFrameRef.current = null;
        videoRef.current = null;
        canvasRef.current = null;
        setIsWebcamOn(false);

    }


    if (!session?.accessToken) {
        return (
            <InfoScreen
                title=""
                description="Please login to continue"
                src="/images/communication.png"
                widget={
                    <CredentialDialog
                        widget={
                            <Button>
                                Login
                            </Button>
                        }
                    />
                }
            />
        );
    }

    if (analyzeMutation.isError) {
        return (
            <InfoScreen
                title="Error"
                description={`Something went wrong while analyzing your face: ${analyzeMutation.error.message}`}
                src="/images/communication.png"
            />
        );
    }


    const handleSafetyDisclaimerClose = () => {
        setShowSafetyDisclaimer(false);
        setShowCitationDisclaimer(true); // Show citation disclaimer after safety disclaimer is closed
    };


    return (
        <div className='flex flex-col min-h-[calc(100vh-4rem)] w-full'>
            {
                process.env.SHOW_DISCLAMER === 'true' && (
                    <>
                        <CitationDisclaimerModal
                            isOpen={showCitationDisclaimer}
                            onClose={() => setShowCitationDisclaimer(false)}
                        />

                        <DisclaimerModal
                            isOpen={showSafetyDisclaimer}
                            onClose={handleSafetyDisclaimerClose}
                        />

                    </>
                )
            }
            <div className='flex flex-col md:items-center items-start px-4 w-full flex-grow'>
                <Breadcrumb className='w-full'>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/overview">Overview</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/face-analyzer">Analyze</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className='flex max-w-[700px] w-full items-center justify-center mt-4'>
                    <div className="flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#966c3b]" />
                        <p className="md:text-4xl text-base font-bold text-[#966c3b]">
                            Face Analyzer
                        </p>
                        <Sparkles className="w-4 h-4 text-[#966c3b]" />
                    </div>
                </div>

                <div className="flex flex-col items-center space-y-4 max-w-[700px] w-full mt-4">
                    {!loadingCamera && showGuidelines && (
                        <GuidelinesDialog
                            loadingCamera={loadingCamera}
                            startWebcam={startWebcam}
                            showGuidelines={showGuidelines}
                            setShowGuidelines={setShowGuidelines}
                            isMobile={isMobile}
                        />
                    )}

                    {!isProcessing && !capturedImage && (
                        <>
                            <div className="w-full h-[calc(100vh-20rem)] md:h-[600px] relative">
                                <FaceMeshView
                                    videoRef={videoRef}
                                    canvasRef={canvasRef}
                                    faceDistance={faceDistance}
                                    headTiltAngle={headTiltAngle}
                                    isWebcamOn={isWebcamOn}
                                    startWebcam={startWebcam}
                                    stopWebcam={stopWebcam}
                                    setShowGuidelines={() => setShowGuidelines(true)}
                                />
                            </div>
                        </>
                    )}

                    {isProcessing && (
                        <>
                            {isStepLoading ? (
                                <div className='flex items-center justify-center h-[calc(100vh-20rem)] md:h-[600px]'>
                                    <Riple
                                        color='orange'
                                        size='large'
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-[calc(100vh-20rem)] md:h-[600px] relative">
                                    <ProcessingView
                                        steps={steps}
                                        currentStep={currentStep}
                                        scanLinePosition={scanLinePosition}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {
                    !isProcessing && !isWebcamOn && !analyzeMutation.isPending && (
                        <div className='flex flex-col items-start justify-start w-full my-8 gap-2'>
                            <p className='text-sm font-bold'>
                                Why scan your face?
                            </p>

                            <div className='grid grid-cols-1 gap-4 w-full'>
                                <ScanInfoCard
                                    title="Track Changes"
                                    description="Monitor your skin changes over time"
                                    icon={<Notebook className='w-4 h-4 text-gray-600' />}
                                />
                                <ScanInfoCard
                                    title="Personalized Recommendations"
                                    description="Find products that work for your unique skin"
                                    icon={<BookOpen className='w-4 h-4 text-gray-600' />}
                                />
                                <ScanInfoCard
                                    title="Early Detection"
                                    description="Spot concerns before they become visible"
                                    icon={<Info className='w-4 h-4 text-gray-600' />}
                                />
                                <ScanInfoCard
                                    title="Save Money"
                                    description="Avoid expensive treatments and products"
                                    icon={<DollarSign className='w-4 h-4 text-gray-600' />}
                                />

                            </div>

                        </div>
                    )
                }


            </div>

            {/* Fixed position footer area */}
            <div className="w-full mt-auto">
                <div className="max-w-[700px] mx-auto">
                    <CitationDisclaimerText onHelp={() => setIsCitationOpen(true)} />
                </div>
            </div>
        </div>
    );
};




const FaceMeshView = ({
    videoRef,
    canvasRef,
    faceDistance,
    headTiltAngle,
    isWebcamOn,
    startWebcam,
    stopWebcam,
    setShowGuidelines
}: {
    videoRef: any;
    canvasRef: any;
    faceDistance: number | null;
    headTiltAngle: number | null;
    isWebcamOn: boolean;
    startWebcam: () => void;
    stopWebcam: () => void;
    setShowGuidelines: () => void;
}) => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const getDistanceMessage = () => {
        if (faceDistance === null) return null;

        if (isMobile) {
            if (faceDistance < 1.9) return "Move Closer";
            if (faceDistance > 2.0) return "Move Further";
        } else {
            if (faceDistance < 0.8) return "Move Closer";
            if (faceDistance > 0.9) return "Move Further";
        }
        return "Perfect Distance";
    };

    const message = getDistanceMessage();
    const isPerfect = message === "Perfect Distance";

    return (
        <div className="relative w-full max-w-4xl aspect-square lg:aspect-video bg-background rounded-lg overflow-hidden h-[500px] md:h-full">
            <video
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full object-cover scale-x-[-1]"
                autoPlay
                playsInline
            />
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full object-cover scale-x-[-1]"
            />
            {message && (
                <div className="absolute top-4 left-4 flex items-center justify-end">
                    <div className={`px-4 py-2 rounded-lg backdrop-blur-sm text-sm font-semibold ${isPerfect ? 'bg-green-500/50 text-white' : 'bg-yellow-500/50 text-white'
                        }`}>
                        {message}
                    </div>
                </div>
            )}

            {!isWebcamOn && (
                <div className="absolute top-0 left-0 w-full h-full bg-background rounded-lg flex items-center justify-center cursor-pointer">
                    <CameraCard setShowGuidelines={setShowGuidelines} />
                </div>
            )}
            {isWebcamOn && (
                <div className="absolute top-4 right-4 w-10 h-10 bg-transparent rounded-lg flex items-center justify-center cursor-pointer">
                    <CameraOff
                        onClick={stopWebcam}
                        className="w-5 h-5 text-black"
                    />
                </div>
            )}
        </div>
    );
};

const CameraCard = ({ setShowGuidelines }: { setShowGuidelines: () => void }) => {
    return (
        <div
            onClick={setShowGuidelines}
            className='flex flex-col items-center justify-center w-full gap-4'>

            <div className='flex flex-col items-center justify-center w-full'>
                <p className='text-xl font-bold text-[#966c3b]'>
                    Discover Your Skin Type
                </p>
                <p className='text-gray-600 text-xs leading-tight text-center mt-1'>
                    One scan reveals your skin type, concerns, and personalized recommendations
                </p>

            </div>


            <div className="w-20 h-20 rounded-full bg-[#966c3b]/10 flex items-center justify-center">
                <Camera className="w-10 h-10 text-[#966c3b]" />
            </div>

            <p className='text-xl leading-tight text-center mt-1 font-bold text-[#966c3b]'>
                Tap to Scan
            </p>



            <div className='flex flex-col items-center justify-center w-full gap-4'>
                <div className='flex flex-row items-center w-full justify-center border border-gray-200 rounded-xl p-4'>
                    <div className='bg-gray-100 rounded-full p-2 mr-2'>
                        <Info className='w-4 h-4 text-gray-600' />
                    </div>

                    <div className='flex flex-col items-start justify-start w-full'>
                        <p className='text-gray-600 text-sm font-bold'>
                            How it works
                        </p>
                        <p className='text-gray-600 text-xs text-muted-foreground  mt-1'>
                            One scan reveals your skin type, concerns, and personalized recommendations
                        </p>
                    </div>

                </div>
                <div className='flex flex-row items-center w-full justify-center border border-gray-200 rounded-xl p-4'>
                    <div className='bg-gray-100 rounded-full p-2 mr-2'>
                        <Info className='w-4 h-4 text-gray-600' />
                    </div>

                    <div className='flex flex-col items-start justify-start w-full'>
                        <p className='text-gray-600 text-sm font-bold'>
                            Your privacy matters
                        </p>
                        <p className='text-gray-600 text-xs text-muted-foreground  mt-1'>
                            All analysis happens on your device. We do not store your data.
                        </p>
                    </div>

                </div>


            </div>


            <Button
                onClick={setShowGuidelines}
                className="cursor-not-allowed text-white w-full"
                size="lg"

            >
                <Camera className='w-4 h-4' />
                Start Scan
            </Button>
        </div>
    )
}

const ScanInfoCard = ({
    title,
    description,
    icon
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
}) => {
    return (
        <div className='flex flex-row items-center w-full justify-center border border-gray-200 rounded-xl p-4 '>
            <div className='bg-gray-100 rounded-full p-2 mr-2'>
                {icon}
            </div>

            <div className='flex flex-col items-start justify-start w-full line-clamp-1'>
                <p className='text-gray-600 text-xs font-bold'>
                    {title}
                </p>
                <p className='text-gray-600 text-xs text-muted-foreground mt-1'>
                    {description}
                </p>
            </div>

        </div>
    )
}

const ProcessingView = ({ steps, currentStep, scanLinePosition }: { steps: any[], currentStep: number, scanLinePosition: number }) => (
    <div className="relative aspect-video rounded-lg overflow-hidden h-[400px] w-full">
        <div className="relative w-full">
            <div className="absolute inset-0">

                <img
                    src={steps[currentStep]?.image}
                    alt={steps[currentStep]?.title}
                    className="w-full h-[400px] object-cover rounded-lg scale-x-[-1]"
                />
            </div>

            <div
                className="absolute inset-0"
                style={{
                    clipPath: `inset(0 ${100 - scanLinePosition}% 0 0)`,
                    transition: 'clip-path 0.1s linear'
                }}
            >
                <img
                    src={steps[(currentStep + 1) % steps.length]?.image}
                    alt={steps[(currentStep + 1) % steps.length]?.title}
                    className="w-full h-[400px] object-contain rounded-lg scale-x-[-1]"
                />
            </div>
        </div>

        <div
            className="absolute top-0 w-1 h-full bg-primary opacity-50"
            style={{
                left: `${scanLinePosition}%`,
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)'
            }}
        />

        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
            <h3 className="font-bold">{steps[currentStep]?.title}</h3>
            <p className="text-sm">{steps[currentStep]?.description}</p>
        </div>
    </div>
);

const GuidelinesDialog = ({
    showGuidelines,
    setShowGuidelines,
    startWebcam,
    loadingCamera,
    isMobile
}: {
    showGuidelines: boolean;
    setShowGuidelines: (value: boolean) => void;
    startWebcam: () => void;
    loadingCamera: boolean;
    isMobile: boolean;
}) => {
    return (
        <Dialog
            open={showGuidelines}
            onOpenChange={setShowGuidelines}
        >
            <DialogContent className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] px-4 md:px-6 rounded-lg max-h-[90vh] flex flex-col p-0">
                <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-6">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Face Scan Guidelines</DialogTitle>
                        <DialogDescription>
                            Guidelines for accurate face scanning and analysis
                        </DialogDescription>
                    </DialogHeader>

                    <img
                        src={isMobile ? "/analyzer_mobile.png" : "/analyzer_web.png"}
                        alt="Face Scan Guidelines"
                        className="w-full rounded-lg object-contain"
                    />
                </div>

                <DialogFooter className="flex-shrink-0 w-full px-4 md:px-6 py-4 bg-white border-t">
                    <Button
                        onClick={startWebcam}
                        className="w-full"
                        disabled={loadingCamera}
                    >
                        {loadingCamera ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start Scan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default FaceMeshDetection;