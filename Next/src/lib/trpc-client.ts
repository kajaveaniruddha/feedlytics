import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

export const trpc = createTRPCProxyClient<any>({
  links: [
    httpBatchLink({
      url: "http://localhost:3001/trpc",
    }),
  ],
});
