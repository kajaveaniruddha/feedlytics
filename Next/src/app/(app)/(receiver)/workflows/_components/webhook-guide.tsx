import React from 'react'
import { IconDeviconPlainSlack } from "@/components/icons/slack"
import { IconPhChatsFill } from "@/components/icons/googlechat"
const WebhookGuide = () => {
    return (
        <div className="mt-10">
            <h2 className="text-xl font-semibold mb-3 text-primary flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                How to create webhooks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                    href="https://www.svix.com/resources/guides/how-to-get-slack-webhook-url/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition bg-white dark:bg-muted"
                >
                    <span className="text-2xl">
                        <IconDeviconPlainSlack />
                    </span>
                    <div>
                        <div className="font-medium text-base">Slack: Create Incoming Webhook</div>
                        <div className="text-sm text-muted-foreground">Step-by-step guide to get your Slack webhook URL</div>
                    </div>
                    <svg className="ml-auto w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
                <a
                    href="https://help.moveworkforward.com/google-workspace/how-to-create-google-chat-incoming-webhook-for-g-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition bg-white dark:bg-muted"
                >
                    <span className="text-2xl">
                        <IconPhChatsFill />
                    </span>
                    <div>
                        <div className="font-medium text-base">Google Chat: Create Incoming Webhook</div>
                        <div className="text-sm text-muted-foreground">Official guide to set up a Google Chat webhook</div>
                    </div>
                    <svg className="ml-auto w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
            </div>
        </div>
    )
}

export default WebhookGuide