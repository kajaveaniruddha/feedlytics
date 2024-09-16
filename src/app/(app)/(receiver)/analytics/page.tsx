"use client";
import React, { useState } from "react";
import { useMessageContext } from "../MessageProvider";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import PieChartMessageCount from "./pie-chart-message-count";
import RadialRatingsChart from "./radial-ratings-chart";
type Props = {};

const page = (props: Props) => {
  const { messageCount, maxMessages } = useMessageContext();
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();

  const { data: session } = useSession();
  const username = session?.user.username;
  return (
    <div className=" container grid grid-cols-2 gap-4 pt-8">
      <PieChartMessageCount messageCount={messageCount} maxMessages={maxMessages}/>
      <RadialRatingsChart/>
    </div>
  );
};

export default page;
