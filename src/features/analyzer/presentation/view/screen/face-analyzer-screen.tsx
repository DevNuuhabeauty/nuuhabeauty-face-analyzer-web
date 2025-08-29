"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Camera, Ban, Scan, AlertCircle, Loader2, Wrench, Upload, Phone, Smartphone, Lightbulb, CameraIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios, { AxiosError } from 'axios';
import FaceAnalyserGuideCard from '../components/face-analyser-guide-card';
import toast from 'react-hot-toast';
import Image from 'next/image';

// Constants
const CONCERN_API_URL = 'http://127.0.0.1:5002';
const ROBOFLOW_API_URL = 'https://outline.roboflow.com/skin_face_detection-hrjd3/2';
const ROBOFLOW_ACNE_API_URL = 'https://detect.roboflow.com/acne-juoph/1';
const ROBOFLOW_API_KEY = '4L0HCdi1fHnyc2EQfg8O';
const ANALYSIS_INTERVAL = 1000;



interface ConcernAnalysisResponse {
    success: boolean;
    predictions: Record<string, number>;
    topCondition: {
        condition: string;
        probability: number;
    };
    error?: string;
}

interface WrinkleAnalysisResponse {
    predictions: Array<{
        class: string;
        confidence: number;
        x: number;
        y: number;
        width: number;
        height: number;
    }>;
}

interface AcneResult {
    confidence: number;
    x: number;
    y: number;
    width: number;
    height: number;
    class: string;
}

const FaceAnalyzerScreen = () => {
    // Refs
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const analysisInterval = useRef<number | null>(null);

    // State
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [detectedCondition, setDetectedCondition] = useState<string | null>(null);
    const [diseaseResults, setConcernResults] = useState<Record<string, number> | null>(null);
    const [wrinkleResults, setWrinkleResults] = useState<WrinkleAnalysisResponse['predictions'] | null>(null);
    const [acneResults, setAcneResults] = useState<AcneResult[] | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Helper Functions
    const captureFrame = () => {
        if (!videoRef.current) return null;

        try {
            const video = videoRef.current;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');

            if (!ctx) throw new Error('Could not get canvas context');

            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0);

            return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        } catch (err) {
            console.error('Error capturing frame:', err);
            return null;
        }
    };

    const analyzeAcne = async (imageData: string) => {
        try {
            setIsAnalyzing(true);
            setError('');

            // Ensure proper base64 formatting
            // Send exactly as provided in the image data
            const response = await axios({
                method: "POST",
                url: ROBOFLOW_ACNE_API_URL,
                params: {
                    api_key: ROBOFLOW_API_KEY
                },
                data: imageData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            console.log('Acne analysis response:', response.data);

            if (!response.data || !response.data.predictions) {
                throw new Error('Invalid response from server');
            }

            const predictions = response.data.predictions;
            setAcneResults(predictions);

            // Calculate severity based on confidence scores
            const acneCount = predictions.length;
            const severityLevels = {
                severe: predictions.filter((p: AcneResult) => p.confidence > 0.8).length,
                moderate: predictions.filter((p: AcneResult) => p.confidence > 0.5 && p.confidence <= 0.8).length,
                mild: predictions.filter((p: AcneResult) => p.confidence <= 0.5).length
            };

            const summary = `Detected ${acneCount} acne ${acneCount === 1 ? 'spot' : 'spots'}:\n` +
                `Severe (>80%): ${severityLevels.severe}\n` +
                `Moderate (50-80%): ${severityLevels.moderate}\n` +
                `Mild (<50%): ${severityLevels.mild}`;

            setDetectedCondition(summary);
            setError('');
        } catch (err: any) {
            console.error('Acne analysis error:', err);
            if (axios.isAxiosError(err)) {
                console.log('Error response:', err.response);
                const errorMessage = err.response?.status === 429 ? 'Rate limit exceeded. Please try again later.'
                    : err.response?.status === 405 ? 'API endpoint not correctly configured. Please check API settings.'
                        : err.response?.status === 401 ? 'Invalid API key. Please check your Roboflow API key.'
                            : err.response?.data?.message || `Failed to analyze image (Status: ${err.response?.status})`;
                setError(errorMessage);
            } else {
                setError('An unexpected error occurred during analysis');
            }
            setAcneResults(null);
            setDetectedCondition(null);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const analyzeConcerns = async (imageData: string) => {
        try {
            const response = await axios.post<ConcernAnalysisResponse>(
                `${CONCERN_API_URL}/api/analyze-face`,
                { image: `data:image/jpeg;base64,${imageData}` },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 5000
                }
            );

            if (response.data.success) {
                setConcernResults(response.data.predictions);
                const probability = response.data.topCondition.probability * 100;
                setDetectedCondition(
                    `${response.data.topCondition.condition} (${probability.toFixed(1)}%)`
                );
            }
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                setError(err.code === 'ECONNABORTED' ? 'Analysis timed out' : 'Cannot connect to disease analysis server');
            }
            toast.error(err.message);


        }
    };

    const analyzeFace = async (imageData: string) => {

        try {
            setIsAnalyzing(true);
            setError('');
            await analyzeConcerns(imageData);


        } catch (err) {
            console.error('Analysis error:', err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Camera Controls
    const startCamera = async () => {

        setIsStreaming(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });

            console.log("Stream" + stream.getTracks());
            if (videoRef.current && stream) {
                videoRef.current.srcObject = stream;
                setError('');
            }
        } catch (err) {
            setError('Unable to access camera. Please ensure you have granted permission.');
            console.error('Error accessing camera:', err);
            setIsStreaming(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject instanceof MediaStream) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsStreaming(false);
        setIsScanning(false);
        setDetectedCondition(null);
        setConcernResults(null);
        setWrinkleResults(null);
        setAcneResults(null);
    };

    const toggleScanning = () => {
        if (isScanning) {
            if (analysisInterval.current) {
                window.clearInterval(analysisInterval.current);
                analysisInterval.current = null;
            }
            setIsScanning(false);
            setDetectedCondition(null);
            setConcernResults(null);
            setIsAnalyzing(false);
        } else {
            setIsScanning(true);
            analysisInterval.current = window.setInterval(() => {
                const frame = captureFrame();
                if (frame && !isAnalyzing) {
                    analyzeFace(frame);
                }
            }, ANALYSIS_INTERVAL);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                setIsAnalyzing(true);
                setError('');

                // Reset previous results
                setAcneResults(null);
                setDetectedCondition(null);

                const reader = new FileReader();
                reader.onload = async (event) => {
                    const base64Data = event.target?.result?.toString();
                    if (!base64Data) throw new Error('Failed to process image');

                    setSelectedImage(base64Data);
                    await analyzeAcne(base64Data);
                };

                reader.onerror = () => {
                    throw new Error('Failed to read file');
                };

                reader.readAsDataURL(file);
            } catch (err) {
                console.error('Error processing image:', err);
                setError('Failed to process image');
                setIsAnalyzing(false);
            }
        }
    };

    // Cleanup Effect
    useEffect(() => {
        return () => {
            stopCamera();
            if (analysisInterval.current) {
                window.clearInterval(analysisInterval.current);
            }
        };
    }, []);


    return (
        <Card className="w-full max-w-2xl mx-auto h-auto">
            <CardHeader>
                <CardTitle>Face Analysis Scanner</CardTitle>
                <CardDescription>
                    One clicked away from personalizing your skincare routine and getting the best results
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {!isStreaming ? (
                    <div
                        onClick={startCamera}
                        className='flex flex-col items-center justify-center gap-8 mt-8 cursor-pointer hover:opacity-90 transition-opacity'>
                        <Image
                            src="/images/facial-recognition.png"
                            alt="Face Analyzer Guide"
                            width={300}
                            height={300}
                            priority
                        />
                        <p className='text-sm text-gray-500'>
                            Press here to start scanning
                        </p>
                    </div>
                ) : (
                    <>
                        <div className='relative'>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover scale-x-[-1] rounded-lg"
                            />
                            <div className="absolute top-4 right-4">
                                <Badge variant={isScanning ? "default" : "secondary"}>
                                    {isAnalyzing ? (
                                        <span className="flex items-center gap-1">
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            Analyzing
                                        </span>
                                    ) : isScanning ? (
                                        <span className="flex items-center gap-1">
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            Scanning
                                        </span>
                                    ) : "Ready"}
                                </Badge>
                            </div>
                        </div>

                        {detectedCondition && diseaseResults && (
                            <Alert className={detectedCondition.includes("No") ? "bg-green-50" : "bg-yellow-50"}>
                                <AlertTitle className="flex items-center gap-2">
                                    <Scan className="h-4 w-4" />
                                    Concern Detection Results
                                </AlertTitle>
                                <AlertDescription>
                                    <div className="space-y-2">
                                        <p>{detectedCondition}</p>
                                        <div className="mt-4">
                                            <p className="font-medium">Other possibilities:</p>
                                            {Object.entries(diseaseResults)
                                                .sort(([, a], [, b]) => b - a)
                                                .slice(1)
                                                .map(([condition, prob]) => (
                                                    <p key={condition} className="text-sm">
                                                        {condition}: {(prob * 100).toFixed(1)}%
                                                    </p>
                                                ))}
                                        </div>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}
                    </>
                )}
            </CardContent>

            <CardFooter className="flex justify-center items-center w-full gap-4">
                {!isScanning && isStreaming && (
                    <Button
                        variant="destructive"
                        onClick={stopCamera}
                        className="flex items-center gap-2"
                    >
                        <Camera className="h-4 w-4" />
                        Stop Camera
                    </Button>
                )}

                {isStreaming && (
                    <Button
                        variant={isScanning ? "secondary" : "default"}
                        onClick={toggleScanning}
                        className="flex items-center gap-2"
                    >
                        <Scan className="h-4 w-4" />
                        {isScanning ? "Stop Scanning" : "Start Scanning"}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

export default FaceAnalyzerScreen;