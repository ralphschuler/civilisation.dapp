import { Link } from "react-router-dom"
import { Home, LayoutDashboard, Group, Sword } from "lucide-react"

export default function BottomNav() {
  return (
    <div className="bg-gray-100 border-t">
      <div className="grid grid-cols-4 text-center text-sm">
        <Link to="/dashboard" className="flex flex-col items-center py-10">
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        <Link to="/buildings" className="flex flex-col items-center py-10">
          <Home className="h-5 w-5" />
          <span>Buildings</span>
        </Link>
        <Link to="/units" className="flex flex-col items-center py-10">
          <Group className="h-5 w-5" />
          <span>Likes</span>
        </Link>
        <Link to="/battle" className="flex flex-col items-center py-10">
          <Sword className="h-5 w-5" />
          <span>Battle</span>
        </Link>
      </div>
    </div>
  )
}
