"use client"
import React, { useState } from 'react'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

interface TanstackProviderProps {
    children: React.ReactNode
}

export const TanstackProvider = ({ children }: TanstackProviderProps) => {
    const [queryClient] = useState(() => new QueryClient)
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default TanstackProvider