"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { api, getErrorMessage } from "./api";

// loads private data once; call reload() after any change
export function useApi<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      setData(await api<T>(path));
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
    setLoading(false);
  }, [path]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, reload };
}
