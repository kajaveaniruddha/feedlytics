"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { useAcceptMessages } from '@/hooks/use-accept-messages';
import { cn } from '@/lib/utils';
import { Switch } from '../ui/switch';

export const FeedbackLink: React.FC = () => {
  const { acceptMessages, isLoading, handleSwitchChange } = useAcceptMessages()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex justify-center w-full z-30"
    >
     <Card className=' w-full'>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Accept Feedbacks</h3>
              <p className={cn("text-sm text-muted-foreground", acceptMessages ? "text-primary" : "text-secondary")}>
                {acceptMessages ? "You are currently accepting feedback" : "You are not accepting feedback right now"}
              </p>
            </div>
            <Switch checked={acceptMessages} disabled={isLoading} onCheckedChange={handleSwitchChange} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
