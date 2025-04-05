"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import SlackChannelForm from "@/app/(app)/(receiver)/workflows/SlackChannelForm"
import type { SlackChannel } from "@/types/ApiResponse"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { IconDeviconPlainSlack } from "@/components/icons/slack"
import { toast } from "@/components/ui/use-toast"
import { useMessageContext } from "@/hooks/use-message-context"

const Page = () => {
    const [channels, setChannels] = useState<SlackChannel[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedChannel, setSelectedChannel] = useState<SlackChannel | null>(null)
    const [togglingChannelId, setTogglingChannelId] = useState<number | null>(null)
    const { maxWorkflows } = useMessageContext()

    const loadChannels = async () => {
        try {
            const res = await axios.get("/api/user-slack-channels")
            if (res.data.success) {
                setChannels(res.data.channels)
                setError(null)
            } else {
                setError(res.data.message || "Error loading channels")
            }
        } catch {
            setError("Error fetching channels")
        } finally {
            setLoading(false)
        }
    }

    const handleEditChannel = (channel: SlackChannel) => {
        setSelectedChannel(channel)
    }

    const handleToggleActive = async (channel: SlackChannel) => {
        setTogglingChannelId(channel.id)
        try {
            const res = await axios.patch("/api/user-slack-channels", {
                id: channel.id,
                channelName: channel.channelName,
                webhookUrl: channel.webhookUrl,
                notifyCategories: channel.notifyCategories,
                isActive: !channel.isActive,
            })
            if (res.data.success) {
                setChannels((prev) => prev.map((ch) => (ch.id === channel.id ? { ...ch, isActive: !channel.isActive } : ch)))
            }
        } catch {
            toast({
                title: "Error",
                description: "Failed to update channel status",
            });
        } finally {
            setTogglingChannelId(null)
        }
    }

    useEffect(() => {
        loadChannels()
    }, [])

    return (
        <motion.section
            className="container py-8 min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h1
                className="text-3xl font-bold mb-4 text-primary"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                Workflows
            </motion.h1>
            <motion.p
                className="text-secondary mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                Manage your workflows to receive real-time feedback alerts directly in your selected channels.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold inline-flex items-center gap-2">
                            <IconDeviconPlainSlack />
                            Slack Channels
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <ChannelListSkeleton />
                        ) : error ? (
                            <div className="flex items-center gap-2 p-4 rounded-md bg-red-50 text-red-500 border border-red-200">
                                <AlertCircle size={18} />
                                <p>{error}</p>
                            </div>
                        ) : channels.length === 0 ? (
                            <div className="text-center py-8 border rounded-md border-dashed">
                                <p className="text-muted-foreground mb-4">No channels found.</p>
                                <p className="text-sm text-muted-foreground">Add a new Slack channel using the form.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {channels.map((channel) => (
                                    <ChannelItem
                                        key={channel.id}
                                        channel={channel}
                                        onEdit={handleEditChannel}
                                        onToggleActive={handleToggleActive}
                                        isToggling={togglingChannelId === channel.id}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="self-start">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            {selectedChannel ? "Update Slack Channel" : "Add Slack Channel"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedChannel || channels.length < maxWorkflows ? (
                            <SlackChannelForm
                                onSuccess={(updatedChannel) => {
                                    if (updatedChannel) {
                                        setChannels((prev) => prev.map((ch) => (ch.id === updatedChannel.id ? updatedChannel : ch)))
                                    } else {
                                        loadChannels()
                                    }
                                    setSelectedChannel(null)
                                }}
                                selectedChannel={selectedChannel}
                            />
                        ) : (
                            <div className="p-4 bg-gray-100 text-center text-sm text-red-600">
                                Maximum workflows reached. You cannot add any more workflows.
                            </div>
                        )}
                        {selectedChannel && (
                            <Button variant="outline" className="mt-4 w-full" onClick={() => setSelectedChannel(null)}>
                                Cancel Editing
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </motion.section>
    )
}

const ChannelItem = ({
    channel,
    onEdit,
    onToggleActive,
    isToggling,
}: {
    channel: SlackChannel
    onEdit: (channel: SlackChannel) => void
    onToggleActive: (channel: SlackChannel) => void
    isToggling: boolean
}) => {
    return (
        <div className="border rounded-lg p-4 hover:bg-muted/20 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold truncate">#{channel.channelName}</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(channel)}>
                    <Edit size={16} />
                    <span className="sr-only">Edit channel</span>
                </Button>
            </div>
            <div className="text-sm text-muted-foreground mb-3 break-all">
                <span className="font-medium text-foreground">Webhook:</span> {truncateMiddle(channel.webhookUrl, 40)}
            </div>
            {channel.notifyCategories && channel.notifyCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {channel.notifyCategories.map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                            {category}
                        </Badge>
                    ))}
                </div>
            )}
            <div className="mt-2">
                {isToggling ? (
                    <Skeleton className="h-6 w-16 rounded-full inline-block" />
                ) : (
                    <Badge className="cursor-pointer" onClick={() => onToggleActive(channel)} variant={channel.isActive ? "default" : "destructive"}>
                        {channel.isActive ? "Active" : "Inactive"}
                    </Badge>
                )}
            </div>
        </div>
    )
}

const ChannelListSkeleton = () => {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                    <Skeleton className="h-4 w-full mb-3" />
                    <div className="flex gap-2 mt-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    )
}

const truncateMiddle = (str: string, maxLength: number) => {
    if (str.length <= maxLength) return str
    const halfLength = Math.floor(maxLength / 2)
    return `${str.substring(0, halfLength)}...${str.substring(str.length - halfLength)}`
}

export default Page

