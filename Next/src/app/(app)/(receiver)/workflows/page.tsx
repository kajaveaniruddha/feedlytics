"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import WorkFlowList from "@/components/custom/workflow-list"
import WorkflowForm from "@/components/custom/workflow-form"
import GroupsListSkeleton from "@/components/custom/workflow-group-list-skeleton"
import { IconDeviconPlainSlack } from "@/components/icons/slack"
import { IconPhChatsFill } from "@/components/icons/googlechat"
import React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { IWorkFlows, ProviderConfig } from "@/types"

const Page = () => {
    const [workflowsData, setWorkflowsData] = useState<Record<string, any[]>>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedWorkflow, setSelectedWorkflow] = useState<IWorkFlows | null>(null)

    const fetchWorkflows = async () => {
        try {
            const res = await axios.get("/api/user-workflows")
            if (res.data.success) {
                setWorkflowsData(res.data.workflows)
                setError(null)
            } else {
                setError(res.data.error || "Error loading workflows")
            }
        } catch (err) {
            setError("Error fetching workflows")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWorkflows()
    }, [])

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
        fetchWorkflows()
    }

    // Global form submit handler clears selection and refreshes data.
    const handleFormSuccess = (updatedWorkflow?: any) => {
        refreshData()
        setSelectedWorkflow(null)
    }

    // Global edit callback: when a list item is edited, update the global form.
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
                {loading ? (
                    <>
                        <GroupsListSkeleton />
                        <GroupsListSkeleton />
                    </>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    providersConfig.map((config) => (
                        <WorkFlowList
                            key={config.id}
                            provider={config.provider}
                            title={config.title}
                            icon={config.icon}
                            emptyListText={config.emptyListText}
                            emptyListSubtext={config.emptyListSubtext}
                            workflows={workflowsData[config.provider] || []}
                            onRefresh={refreshData}
                            onEdit={handleEdit}
                        />
                    ))
                )}
            </div>
        </motion.section >
    )
}

export default Page

