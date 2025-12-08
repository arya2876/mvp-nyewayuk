"use client";
import React, { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./ThemeProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <EdgeStoreProvider>
          <ThemeProvider>
            <Toaster position="bottom-right"/>
            {children}
          </ThemeProvider>
        </EdgeStoreProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default Providers;
