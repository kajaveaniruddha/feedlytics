"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useDebounceCallback } from "usehooks-ts";

interface UseCheckUsernameOptions {
  currentUsername?: string;
}

export function useCheckUsername(options?: UseCheckUsernameOptions) {
  const [username, setUsername] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const debouncedSetUsername = useDebounceCallback(setUsername, 300);

  useEffect(() => {
    const checkUsername = async () => {
      if (!username) {
        setUsernameMessage("");
        return;
      }

      if (options?.currentUsername === username) {
        setUsernameMessage("Username is available");
        return;
      }

      setIsCheckingUsername(true);
      setUsernameMessage("");
      try {
        const response = await api.checkUsernameUnique(username);
        setUsernameMessage(response.data.message);
      } catch (error) {
        setUsernameMessage(
          (error as Error).message || "Error checking username"
        );
      } finally {
        setIsCheckingUsername(false);
      }
    };

    checkUsername();
  }, [username, options?.currentUsername]);

  return { isCheckingUsername, usernameMessage, debouncedSetUsername };
}
