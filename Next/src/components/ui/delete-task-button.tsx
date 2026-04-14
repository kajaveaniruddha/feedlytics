// DeleteTasksButton.tsx
import { Loader2, Trash2 } from "lucide-react";
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
import { api } from "@/lib/api";
import { useToast } from "./use-toast";
import { useState } from "react";

interface DeleteTasksButtonProps {
  table: any;
  onDeleteSuccess: () => void;
}

const DeleteTasksButton = ({
  table,
  onDeleteSuccess,
}: DeleteTasksButtonProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async (ids: string[]) => {
    try {
      setLoading(true);
      await api.deleteMessages(ids);
      table.setRowSelection({});
      onDeleteSuccess();
      toast({
        title: "Success",
        description: "Messages deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete messages.",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedIds = table.getSelectedRowModel().rows.map(
    (row: any) => row.original.id
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={selectedIds.length === 0 ? "default" : "destructive"}
          disabled={selectedIds.length === 0 || loading}
          className="flex items-center w-fit"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
          ) : (
            <Trash2 size={14} />
          )}
          &nbsp;DELETE
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the message from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500"
            onClick={() => {
              if (selectedIds.length > 0) {
                handleDelete(selectedIds);
              }
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTasksButton;
