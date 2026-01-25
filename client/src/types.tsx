import { CredentialResponse } from "@react-oauth/google";

// auth-related
export type AuthContext = {
  userId?: string;
  handleLogin: (credentialResponse: CredentialResponse) => void;
  handleLogout: () => void;
};

//sidebar-related
export type SidebarMode = "normal" | "notifs" | "msgs" | "hidden";
