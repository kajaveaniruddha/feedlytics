"use client"
import React from "react"
import type { IWorkFlows, WorkflowsListProps } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import axios from "axios"
import WorkflowGroupItem from "@/components/custom/workflow-group-item"

const WorkFlowList: React.FC<WorkflowsListProps> = ({
    provider,
    title,
    icon,
    emptyListText,
    emptyListSubtext,
    workflows,
    onRefresh,
    onEdit,
}) => {
    const [togglingId, setTogglingId] = React.useState<number | null>(null)

    const handleToggleActive = async (workflow: IWorkFlows) => {
        if (!workflow.id) { // Check if workflow.id is present before proceeding
            toast({
                title: "Error",
                description: "Workflow id is missing",
            })
            return
        }
        setTogglingId(workflow.id)
        try {
            const res = await axios.patch("/api/user-workflows", {
                id: workflow.id,
                provider: workflow.provider,
                groupName: workflow.groupName,
                webhookUrl: workflow.webhookUrl,
                notifyCategories: workflow.notifyCategories,
                isActive: !workflow.isActive,
            })
            if (res.data.success) {
                onRefresh()
            }
        } catch {
            toast({
                title: "Error",
                description: "Failed to update workflow status",
            })
        } finally {
            setTogglingId(null)
        }
    }

    return (
        <Card className="h-fit mb-6">
            <CardHeader>
                <CardTitle className="text-xl font-semibold inline-flex items-center gap-2">
                    {icon} {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {workflows.length === 0 ? (
                    <div className="text-center py-8 border rounded-md border-dashed">
                        <p className="text-muted-foreground mb-4">{emptyListText}</p>
                        <p className="text-sm text-muted-foreground">{emptyListSubtext}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {workflows.map((workflow, i) => (
                            <WorkflowGroupItem
                                key={workflow.id || `${workflow.groupName}-${i}`}
                                workflow={{ ...workflow, provider: provider }}
                                onEdit={onEdit}
                                onToggleActive={handleToggleActive}
                                isToggling={togglingId === workflow.id}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default WorkFlowList