import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { truncateMiddle } from "@/config/truncateMiddle";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkflowGroupItemProps<T extends { id: number; webhookUrl: string; notifyCategories: string[]; isActive: boolean }> {
    item: T;
    nameFieldKey: keyof T;  // the key that holds the display name (e.g. "channelName" or "spaceName")
    onEdit: (item: T) => void;
    onToggleActive: (item: T) => void;
    isToggling: boolean;
}

const WorkflowGroupItem = <T extends { id: number; webhookUrl: string; notifyCategories: string[]; isActive: boolean }>({
    item,
    nameFieldKey,
    onEdit,
    onToggleActive,
    isToggling,
}: WorkflowGroupItemProps<T>) => {
    const displayName = String(item[nameFieldKey]);
    return (
        <div className="border rounded-lg p-4 hover:bg-muted/20 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold truncate">#{displayName}</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(item)}>
                    <Edit size={16} />
                    <span className="sr-only">Edit {displayName}</span>
                </Button>
            </div>
            <div className="text-sm text-muted-foreground mb-3 break-all">
                <span className="font-medium text-foreground">Webhook:</span> {truncateMiddle(item.webhookUrl, 40)}
            </div>
            {item.notifyCategories && item.notifyCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {item.notifyCategories.map((category) => (
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
                    <Badge className="cursor-pointer" onClick={() => onToggleActive(item)} variant={item.isActive ? "default" : "destructive"}>
                        {item.isActive ? "Active" : "Inactive"}
                    </Badge>
                )}
            </div>
        </div>
    );
};

export default WorkflowGroupItem;