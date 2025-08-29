"use client"
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, X, Info } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUserDisable } from "../../tanstack/user-tanstack";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const DeleteAccountScreen = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const router = useRouter();

    const {
        mutate: disableUser,
        isPending: disableUserPending,
        isError: disableUserError,
        isSuccess: disableUserSuccess
    } = useUserDisable();


    const handleConfirmDelete = async () => {
        if (confirmText.toLowerCase() !== "delete my account") {
            setErrorMessage("Please type 'delete my account' to confirm");
            return;
        }
        setIsDeleting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // // Redirect to a success page or login page after successful deletion
        // window.location.href = "/account-deleted";
        // handleDeleteRequest();
        setIsDeleting(false);
        disableUser();

    };

    return (
        <div className="container max-w-3xl mx-auto px-4 py-8">
            <Card className="border border-border shadow-sm">
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-semibold">Delete Account</CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground mt-1">
                        Permanently delete your NuuhaBeauty Analyzer account and all associated data
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                    <Alert className="bg-orange-50 border-destructive/40">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <AlertDescription className="text-sm text-foreground">
                            <span className="font-semibold">Warning:</span> This action is permanent and cannot be undone.
                            All your data, including saved preferences and history, will be permanently removed.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                        <h3 className="font-medium text-lg">Before you delete your account:</h3>

                        <div className="space-y-2 pl-5">
                            <div className="flex gap-2">
                                <div className="w-1 h-1 rounded-full bg-foreground mt-2.5"></div>
                                <p className="text-sm">Your account will be permanently deleted from our system</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-1 h-1 rounded-full bg-foreground mt-2.5"></div>
                                <p className="text-sm">You will lose access to all saved resources and preferences</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-1 h-1 rounded-full bg-foreground mt-2.5"></div>
                                <p className="text-sm">If you have an active subscription, it will be canceled</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-1 h-1 rounded-full bg-foreground mt-2.5"></div>
                                <p className="text-sm">This action cannot be reversed</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-secondary/50 rounded-lg p-4 flex items-start gap-3">
                        <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm">
                            If you're encountering issues with NuuhaBeauty Analyzer, please consider
                            {/* <a href="/contact" className="text-primary hover:underline mx-1">contacting our support team</a> */}
                            before deleting your account. We're here to help resolve any problems you might be experiencing.
                        </p>
                    </div>
                </CardContent>

                <CardFooter className="border-t pt-6 flex justify-end">
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => router.push('/overview')}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setIsDialogOpen(true);
                            }}
                        >
                            Delete Account
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            {/* Confirmation Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-destructive flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Confirm Account Deletion
                        </DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. All your personal data will be permanently deleted.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">
                            To confirm, please type <span className="font-medium text-foreground">delete my account</span> below:
                        </p>

                        <div className="space-y-2">
                            <Input
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder="delete my account"
                                className="w-full"
                                autoComplete="off"
                            />

                            {errorMessage && (
                                <p className="text-xs text-destructive mt-1">{errorMessage}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="flex sm:justify-between">
                        <Button
                            variant="outline"
                            // onClick={() => {
                            //     setIsDialogOpen(false);
                            //     setConfirmText("");
                            //     setErrorMessage("");
                            // }}
                            onClick={() => {
                                toast.success('Account deleted successfully');
                                // router.push('/overview');
                            }}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Permanently Delete Account"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DeleteAccountScreen;