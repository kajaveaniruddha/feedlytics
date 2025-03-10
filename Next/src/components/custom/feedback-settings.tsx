"use client";

import React, { useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAcceptMessages } from "@/hooks/use-accept-messages";
import { Copy, Link as LinkIcon } from 'lucide-react';
import Link from "next/link";
import { Textarea } from "../ui/textarea";
export const FeedbackSettings = React.memo(({ username }: { username: string }) => {
  const { toast } = useToast();
  const { acceptMessages, isLoading, handleSwitchChange } = useAcceptMessages();

  const profileUrl =
    typeof window !== "undefined" ? `${window.location.host}/u/${username}` : "";

  const widget_script = `<my-widget username=${username}></my-widget>
<script src="${process.env.NEXT_PUBLIC_WIDGET_URL}/widget.umd.js"></script>`

  const copyToClipboard = useCallback(() => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: "URL Copied",
        description: "Profile URL has been copied to clipboard.",
      });
    }
  }, [profileUrl, toast]);

  const copyWidgetToClipboard = useCallback(() => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(widget_script);
      toast({
        title: "Widget Script Copied",
        description: "Widget script has been copied to clipboard.",
      });
    }
  }, [widget_script, toast]);

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Your unique link
          </CardTitle>
          <CardDescription>Share this link to receive feedback from others</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-4">
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
          <div className="flex gap-3 items-center">
            <Textarea
              value={widget_script}
              readOnly
              className=" text-primary"
            />
            <Button
              onClick={copyWidgetToClipboard}
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
            <Link href="/metadata" className=" bg-primary  text-primary-foreground p-2 rounded-md">Metadata</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

FeedbackSettings.displayName = "FeedbackSettings";