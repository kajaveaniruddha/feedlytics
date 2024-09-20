"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../../../../components/ui/button";
import { Message } from "@/model/User";
import { useToast } from "../../../../components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";
import { TableCell, TableRow } from "@/components/ui/table";
import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash, Trash2 } from "lucide-react";

type MessageCardProps = {
  id: number;
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ id, message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();
  const [showMore, setShowMore] = useState<boolean>(false);

  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    );
    toast({ title: response.data.message });
    onMessageDelete(message._id as string);
  };

  const msg = message.content || "Couldn't fetch this message.";
  const isLongMessage = msg.length > 200;

  return (
    <TableRow key={id}>
      <TableCell className="font-medium">{id}</TableCell>
      <TableCell className={`font-bold ${message.stars == 5 && "text-green-600"} ${message.stars == 1 && "text-red-600"}`}>{message.stars}</TableCell>
      <TableCell>
        {isLongMessage && !showMore ? (
          <>
            {msg.substring(0, 200)}...
            <br />
            <Button
              variant="link"
              onClick={() => setShowMore(true)}
            >
              read more
            </Button>
          </>
        ) : (
          <>{msg}</>
        )}
        <AnimatePresence initial={false}>
          {showMore && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p>{msg.substring(100)}</p>
              <Button
                variant="link"
                onClick={() => setShowMore(false)}
              >
                read less
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </TableCell>
      <TableCell>
        <AlertDialog>
          <AlertDialogTrigger>
            <Trash2 size={20} className=" opacity-70 hover:opacity-100 transition-all" />
        </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete
                the message from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
};

export default memo(MessageCard);
