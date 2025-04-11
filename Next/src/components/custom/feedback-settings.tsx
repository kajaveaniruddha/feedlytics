"use client"

import React, { useCallback, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAcceptMessages } from "@/hooks/use-accept-messages"
import { Check, Copy, LinkIcon, Code } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export const FeedbackSettings = React.memo(({ username }: { username: string }) => {
  const { toast } = useToast()
  const { acceptMessages, isLoading, handleSwitchChange } = useAcceptMessages()
  const [urlCopied, setUrlCopied] = useState(false)
  const [widgetCopied, setWidgetCopied] = useState(false)

  const profileUrl = typeof window !== "undefined" ? `${window.location.host}/u/${username}` : `feedlytics.in/u/${username}`
  const widget_script = `<my-widget username="${username}"></my-widget>
  <script src="${process.env.NEXT_PUBLIC_WIDGET_URL}/widget.umd.js"></script>`
  
  console.log("profileUrl", profileUrl)
  console.log("widget_script", widget_script)
  
  const copyToClipboard = useCallback(() => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(profileUrl)
      setUrlCopied(true)
      toast({
        title: "URL Copied",
        description: "Profile URL has been copied to clipboard.",
      })

      setTimeout(() => setUrlCopied(false), 2000)
    }
  }, [profileUrl, toast])

  const copyWidgetToClipboard = useCallback(() => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(widget_script)
      setWidgetCopied(true)
      toast({
        title: "Widget Script Copied",
        description: "Widget script has been copied to clipboard.",
      })

      setTimeout(() => setWidgetCopied(false), 2000)
    }
  }, [widget_script, toast])

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Your unique link
          </CardTitle>
          <CardDescription>Share this link to receive feedback from others</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Input type="text" value={profileUrl} readOnly className="pr-20 text-primary truncate" />
            <Button onClick={copyToClipboard} variant="outline" className="sm:w-auto w-full">
              {urlCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              Copy Link
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Widget Embed Code
          </CardTitle>
          <CardDescription>Add this code to your website to display the feedback widget</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="relative">
              <Textarea value={widget_script} readOnly rows={3} className="font-mono text-sm text-primary pr-10" />
            </div>
            <Button onClick={copyWidgetToClipboard} variant="outline" className="w-full sm:w-auto">
              {widgetCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              Copy Widget Code
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Accept Feedbacks</h3>
              <p className={cn("text-sm text-muted-foreground", acceptMessages ? "text-primary" : "text-yellow-500")}>
                {acceptMessages ? "You are currently accepting feedback" : "You are not accepting feedback right now"}
              </p>
            </div>
            <Switch checked={acceptMessages} disabled={isLoading} onCheckedChange={handleSwitchChange} />
          </div>
        </CardContent>
      </Card>

      {/* <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Feedback Page Details</h3>
              <p className="text-sm text-muted-foreground">Customize how your feedback page looks</p>
            </div>
            <Link
              href="/metadata"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md w-full sm:w-auto text-center"
            >
              Metadata
            </Link>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
})

FeedbackSettings.displayName = "FeedbackSettings"

