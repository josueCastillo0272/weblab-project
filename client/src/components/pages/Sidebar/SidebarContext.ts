import { createContext } from "react";
import { SidebarMode } from "../../../../../shared/types";
import Sidebar from "./Sidebar";

interface SidebarContextType {
  state: SidebarMode;
  setState: (state: SidebarMode) => void;
}
const SidebarContext = createContext<SidebarContextType | null>(null);
export default SidebarContext;
