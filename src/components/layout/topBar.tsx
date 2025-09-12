import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import StatusRow from "@/components/layout/statusRow"
import SideDrawer from "@/components/layout/sideDrawer"
import { Bell, BarChart, Heart, Settings } from "lucide-react"

export default function TopBar() {
  return (
    <div className="bg-gray-100 border-b">
      <div className="flex justify-between items-center px-2 py-1">
        {/* Drawer / Hamburger */}
        <SideDrawer />

        {/* Erste Reihe */}
        <StatusRow
          items={[
            { icon: <Bell className="w-4 h-4" />, value: "12" },
            { icon: <BarChart className="w-4 h-4" />, value: "5k" },
            { icon: <Heart className="w-4 h-4" />, value: "77" },
            { icon: <Settings className="w-4 h-4" />, value: "OK" },
          ]}
        />

        {/* Avatar rechts */}
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>

      {/* Zweite Reihe */}
      <StatusRow
        items={[
          { icon: <Bell className="w-4 h-4" />, value: "3" },
          { icon: <BarChart className="w-4 h-4" />, value: "99" },
          { icon: <Heart className="w-4 h-4" />, value: "200" },
          { icon: <Settings className="w-4 h-4" />, value: "ON" },
        ]}
      />
    </div>
  )
}
