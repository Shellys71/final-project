import React, { useCallback, useState } from "react";

import ErrorModel from "../models/error";

type requestConfigObj = {
  url: string;
  method?: string;
  headers?: any;
  body?: any;
};

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorModel | null>(null);

  const sendRequest = useCallback(async (requestConfig: requestConfigObj, applyData: (data: any) => void) => {
    setIsLoading(true);
    setError(null);
    const response = await fetch(requestConfig.url, {
      method: requestConfig.method ? requestConfig.method : "GET",
      headers: requestConfig.headers ? requestConfig.headers : {},
      body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
    });

    if (!response.ok) {
      setError({
        code: response.status,
        info: response.statusText,
      });
    } else {
      const data = await response.json();
      applyData(data);
    }
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
  };
};

export default useHttp;
