import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import StatusRow from "@/components/layout/statusRow"
import SideDrawer from "@/components/layout/sideDrawer"
import { Bell, BarChart, Heart, Settings } from "lucide-react"
import { MiniKit } from "@worldcoin/minikit-js"

export default function TopBar() {
  return (
    <div className="bg-gray-100 border-b">
      <div className="flex justify-between items-center px-2 py-1">
        <SideDrawer />

        <div>
          <StatusRow
            items={[
              { icon: <Bell className="w-4 h-4" />, value: "12" },
              { icon: <BarChart className="w-4 h-4" />, value: "5k" },
              { icon: <Heart className="w-4 h-4" />, value: "77" },
              { icon: <Settings className="w-4 h-4" />, value: "OK" },
            ]}
          />

          <StatusRow
            items={[
              { icon: <Bell className="w-4 h-4" />, value: "3" },
              { icon: <BarChart className="w-4 h-4" />, value: "99" },
              { icon: <Heart className="w-4 h-4" />, value: "200" },
              { icon: <Settings className="w-4 h-4" />, value: "ON" },
            ]}
          />
        </div>


        <Avatar className="h-8 w-8">
          <AvatarImage src={MiniKit.user.profilePictureUrl} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
