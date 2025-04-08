import React from "react";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { truncateMiddle } from "@/config/truncateMiddle";
import { Skeleton } from "@/components/ui/skeleton";
import { IWorkFlows } from "@/types";
import Link from "next/link";

const WorkflowGroupItem = ({
    workflow,
    onEdit,
    onToggleActive,
    isToggling,
}: {
    workflow: IWorkFlows
    onEdit: (workflow: IWorkFlows) => void
    onToggleActive: (workflow: IWorkFlows) => void
    isToggling: boolean
}) => {
    return (
        <div className="border rounded-lg p-4 hover:bg-muted/20 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold truncate">#{workflow.groupName}</h3>
                <Link
                    href="#workflow-form"
                    aria-label="Edit Workflow"
                    className="h-8 w-8 flex justify-center items-center transition-all rounded-xl hover:bg-accent hover:text-accent-foreground"
                    onClick={(e) => {
                        onEdit(workflow);
                    }}
                >
                    <Edit size={16} />
                </Link>
            </div>
            <div className="text-sm text-muted-foreground mb-3 break-all">
                <span className="font-medium text-foreground">Webhook:</span> {truncateMiddle(workflow.webhookUrl, 40)}
            </div>
            {workflow.notifyCategories && workflow.notifyCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {workflow.notifyCategories.map((category) => (
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
                    <Badge className="cursor-pointer" onClick={() => onToggleActive(workflow)} variant={workflow.isActive ? "default" : "destructive"}>
                        {workflow.isActive ? "Active" : "Inactive"}
                    </Badge>
                )}
            </div>
        </div>
    )
}

export default WorkflowGroupItem;