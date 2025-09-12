import { Link } from "react-router-dom"
import { Home, BarChart, Heart, Settings } from "lucide-react"

export default function BottomNav() {
  return (
    <div className="bg-gray-100 border-t">
      <div className="grid grid-cols-4 text-center text-sm">
        <Link to="/" className="flex flex-col items-center py-2">
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link to="/stats" className="flex flex-col items-center py-2">
          <BarChart className="h-5 w-5" />
          <span>Stats</span>
        </Link>
        <Link to="/likes" className="flex flex-col items-center py-2">
          <Heart className="h-5 w-5" />
          <span>Likes</span>
        </Link>
        <Link to="/settings" className="flex flex-col items-center py-2">
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  )
}
