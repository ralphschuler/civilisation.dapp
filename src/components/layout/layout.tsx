import TopBar from "@/components/layout/topBar"
import BottomNav from "@/components/layout/bottomNav"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-full">
      <TopBar />
      <div className="flex-1 overflow-auto">{children}</div>
      <BottomNav />
    </div>
  )
}
