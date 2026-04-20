import { useState, useEffect } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { api } from "@/lib/api";

export function useCheckUsername(
  currentUsername?: string
) {
  const [username, setUsername] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const debounced = useDebounceCallback(setUsername, 300);

  useEffect(() => {
    const checkUsername = async () => {
      if (!username) {
        setUsernameMessage("");
        return;
      }

      if (currentUsername && currentUsername === username) {
        setUsernameMessage("Username is available");
        return;
      }

      setIsCheckingUsername(true);
      setUsernameMessage("");
      try {
        const response = await api.checkUsernameUnique(username);
        setUsernameMessage(response.data.message || "Username is available");
      } catch (error) {
        setUsernameMessage(
          (error as Error).message || "Error checking username"
        );
      } finally {
        setIsCheckingUsername(false);
      }
    };

    checkUsername();
  }, [username, currentUsername]);

  return { isCheckingUsername, usernameMessage, debounced };
}
