"use client";

import { useState, useCallback } from "react";
import api from "@/_lib/api";

export function useApi() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const request = useCallback(async function<T = any>(
        method: "get" | "post" | "put" | "delete",
        url: string,
        data?: any
    ): Promise<T> {
        try {
            setLoading(true);
            setError(null);

            const response = await api.request<T>({
                method,
                url,
                data,
            });

            return response.data;
        } catch (err: any) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { request, loading, error };
}
