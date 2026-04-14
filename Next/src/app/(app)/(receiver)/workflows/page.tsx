"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { api } from "@/lib/api"
import WorkFlowList from "@/components/custom/workflow-list"
import WorkflowForm from "@/components/custom/workflow-form"
import GroupsListSkeleton from "@/components/custom/workflow-group-list-skeleton"
import { IconDeviconPlainSlack } from "@/components/icons/slack"
import { IconPhChatsFill } from "@/components/icons/googlechat"
import React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { IWorkFlows, ProviderConfig } from "@/types"
import WebhookGuide from "@/components/custom/webhook-guide"
import { useQuery } from "@tanstack/react-query"
import { useApiErrorToast } from "@/hooks/use-api-error-toast"

const Page = () => {
    const [selectedWorkflow, setSelectedWorkflow] = useState<IWorkFlows | null>(null)

    const {
        data: workflowsData,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<Record<string, any[]>>({
        queryKey: ["user-workflows"],
        queryFn: async () => {
            const res = await api.getWorkflows()
            if (!res.data.success) {
                throw new Error(res.data.error || "Error loading workflows")
            }
            return res.data.workflows as Record<string, any[]>
        },
        staleTime: 5000,
        refetchOnWindowFocus: false,
    })

    useApiErrorToast(isError, error as Error | null)

    const providersConfig: ProviderConfig[] = [
        {
            id: 1,
            provider: "slack",
            title: "Slack Channels",
            icon: <IconDeviconPlainSlack />,
            emptyListText: "No Slack channels found.",
            emptyListSubtext: "Add a new Slack channel using the form.",
        },
        {
            id: 2,
            provider: "googlechat",
            title: "Google Chat Spaces",
            icon: <IconPhChatsFill />,
            emptyListText: "No Google Chat spaces found.",
            emptyListSubtext: "Add a new Google Chat space using the form.",
        },
    ]

    const refreshData = () => {
        refetch()
    }

    const handleFormSuccess = (updatedWorkflow?: any) => {
        refreshData()
        setSelectedWorkflow(null)
    }

    const handleEdit = (workflow: any) => {
        setSelectedWorkflow(workflow)
    }

    return (
        <motion.section
            className="container py-8 min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            id="workflow-form"
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
                className="text-secondary-foreground mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                Manage your workflows to receive real-time feedback alerts directly in your selected groups.
            </motion.p>

            <Card className=" h-fit">
                <CardHeader>
                    {selectedWorkflow ? "Edit Workflow" : "Add Workflow"}
                </CardHeader>
                <CardContent>
                    <WorkflowForm onSuccess={handleFormSuccess} selectedWorkflow={selectedWorkflow} />
                    {selectedWorkflow && (
                        <button
                            className="mt-4 w-full border p-2 rounded text-sm"
                            onClick={() => setSelectedWorkflow(null)}
                        >
                            Cancel Editing
                        </button>
                    )}
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {isLoading ? (
                    <>
                        <GroupsListSkeleton />
                        <GroupsListSkeleton />
                    </>
                ) : isError ? (
                    <p className="text-red-600">{(error as Error)?.message || "Error loading workflows"}</p>
                ) : (
                    providersConfig.map((config) => (
                        <WorkFlowList
                            key={config.id}
                            provider={config.provider}
                            title={config.title}
                            icon={config.icon}
                            emptyListText={config.emptyListText}
                            emptyListSubtext={config.emptyListSubtext}
                            workflows={workflowsData?.[config.provider] || []}
                            onRefresh={refreshData}
                            onEdit={handleEdit}
                        />
                    ))
                )}
            </div>
            <WebhookGuide />
        </motion.section >
    )
}

export default Page
