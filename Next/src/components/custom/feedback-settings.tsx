"use client";

import React, { useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAcceptMessages } from "@/hooks/use-accept-messages";
import { Copy, Link } from 'lucide-react';
import dynamic from "next/dynamic";

const EditFormDetails = dynamic(() => import("@/components/custom/edit-form-details"), {
  loading: () => <Skeleton className="w-full h-full bg-background" />,
});

export const FeedbackSettings = React.memo(({ username }: { username: string }) => {
  const { toast } = useToast();
  const { acceptMessages, isLoading, handleSwitchChange } = useAcceptMessages();

  const profileUrl =
    typeof window !== "undefined" ? `${window.location.host}/u/${username}` : "";

  const copyToClipboard = useCallback(() => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: "URL Copied",
        description: "Profile URL has been copied to clipboard.",
      });
    }
  }, [profileUrl, toast]);

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-4 h-4" />
            Your unique link
          </CardTitle>
          <CardDescription>Share this link to receive feedback from others</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input 
              type="text" 
              value={profileUrl} 
              readOnly 
              className=" text-primary"
            />
            <Button 
              onClick={copyToClipboard}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">Accept Echos</h3>
              <p className="text-sm text-secondary">
                {acceptMessages 
                  ? "You are currently accepting feedback" 
                  : "You are not accepting feedback right now"}
              </p>
            </div>
            <Switch
              checked={acceptMessages}
              disabled={isLoading}
              onCheckedChange={handleSwitchChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 w-full">
              <h3 className="text-lg font-semibold text-white">Feedback Page Details</h3>
              <p className="text-sm text-secondary">Customize how your feedback page looks</p>
            </div>
            <EditFormDetails />
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

FeedbackSettings.displayName = "FeedbackSettings";