import TopBar from "@/components/layout/topBar"
import BottomNav from "@/components/layout/bottomNav"
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen w-full">
      <TopBar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}
