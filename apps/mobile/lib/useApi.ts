import { useMemo } from "react";
import { createApiClient } from "./api";
import { getAccessToken } from "./auth";

export function useApi() {
  return useMemo(() => createApiClient({ getToken: getAccessToken }), []);
}
