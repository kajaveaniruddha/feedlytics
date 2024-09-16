"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import EditFormDetails from "@/components/edit-form-details";
import MessageTable from "./MessageTable";

const TotalMessagesPieChart = dynamic(
  () => import("@/components/total-messages-pie-chart"),
  { loading: () => <Skeleton className=" w-full h-full bg-white " /> }
);
const Page = () => {
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.get(`/api/accept-messages`);
      setValue("acceptMessages", await res.data?.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({ title: "Error", description: axiosError.response?.data.message });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessage();
  }, [session, fetchAcceptMessage, setValue]);

  const handleSwitchChange = async () => {
    try {
      const res = await axios.post<ApiResponse>(`/api/accept-messages`, {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({ title: res.data.message });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
      });
    }
  };

  const username = session?.user.username;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied",
      description: "Profile url has been copied to clipboard.",
    });
  };
  if (!session || !session.user) {
    return (
      <div className=" flex justify-center items-center">Please Login</div>
    );
  }
  return (
    <section className=" my-8 mx-4 rounded lg:max-w-6xl md:max-w-5xl max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Welcome {username}!</h1>
      <div className="flex gap-4 justify-around w-full mb-4 h-[250px] rounded-lg">
        <div className="w-full">
          <Card className=" p-4">
            <h2 className="text-lg font-semibold mb-2 ">
              Copy your unique link
            </h2>
            <div className=" w-full flex">
              <Input
                type="text"
                value={profileUrl}
                disabled
                className=" w-full p-2 mr-2"
              />
              <Button onClick={copyToClipboard}>Copy</Button>
            </div>
          </Card>
          <Card className="mt-2 p-4 flex justify-between">
            <span className="ml-2">
              Accept Echos: {acceptMessages ? "ON" : "OFF"}
            </span>
            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              disabled={isSwitchLoading}
              onCheckedChange={handleSwitchChange}
            />
          </Card>
          <Card className=" p-3 mt-2 flex justify-between items-center">
            Update Collection page details <EditFormDetails />
          </Card>
        </div>
        <div className="w-full">
          <TotalMessagesPieChart username={username} />
        </div>
      </div>
      <MessageTable />
    </section>
  );
};

export default Page;
