import { useMemo } from "react";

export const useEndpoint = () => {
  const endpoint = useMemo(() => {
    return "https://mainnet.helius-rpc.com/?api-key=d31340bd-19ab-4fd6-9d30-f6b8360f7f29";
  }, []);

  return endpoint;
};

export default useEndpoint;
