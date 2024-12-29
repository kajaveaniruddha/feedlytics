"use client";

import React, { useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAcceptMessages } from "@/hooks/use-accept-messages";
import dynamic from "next/dynamic";

const EditFormDetails = dynamic(() => import("@/components/custom/edit-form-details"), {
  loading: () => <Skeleton className="w-full h-full bg-white" />,
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
    <div className="w-full">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">Copy your unique link</h2>
        <div className="w-full flex">
          <Input type="text" value={profileUrl} disabled className="w-full p-2 mr-2" />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </Card>
      <Card className="mt-2 p-4 flex justify-between">
        <span className="ml-2">
          Accept Echos: {acceptMessages ? "ON" : "OFF"}
        </span>
        <Switch
          checked={acceptMessages}
          disabled={isLoading}
          onCheckedChange={handleSwitchChange}
        />
      </Card>
      <Card className="p-3 mt-2 flex justify-between items-center">
        Update Feedback Page Details
        <EditFormDetails />
      </Card>
    </div>
  );
});

FeedbackSettings.displayName = "FeedbackSettings";