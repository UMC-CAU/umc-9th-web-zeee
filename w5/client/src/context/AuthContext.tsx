import type { RequestSigninDto } from "../types/auth";
import { createContext, type PropsWithChildren } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.ts";
import { LOCAL_STORAGE_KEY } from "../constants/key.ts";

interface AuthContextype {
  accesstoken: string | null;
  refreshToken: string | null;
  login: (signinData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: async () => {},
});
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const {} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
};
