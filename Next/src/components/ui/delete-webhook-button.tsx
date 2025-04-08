import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "./alert-dialog";
import { Button } from "./button";
import { useToast } from "./use-toast";

interface DeleteWebhookButtonProps {
    channelId: string | number;
    onDeleteSuccess: () => void;
    disableState: boolean
}

const DeleteWebhookButton: React.FC<DeleteWebhookButtonProps> = ({ channelId, onDeleteSuccess, disableState }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            await axios.delete("/api/user-workflows", { data: { id: channelId } });
            toast({ title: "Deleted", description: "Webhook deleted successfully." });
            onDeleteSuccess();
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: "Failed to delete webhook." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className=" w-full" disabled={loading || disableState}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 size={14} />}
                    &nbsp;Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this webhook? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-500">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteWebhookButton;
