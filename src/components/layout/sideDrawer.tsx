import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Link } from "react-router-dom"

export default function SideDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <div className="flex flex-col gap-2 mt-4">
          <Link to="/" className="w-full">
            <Button variant="outline" className="w-full">Home</Button>
          </Link>
          <Link to="/stats" className="w-full">
            <Button variant="outline" className="w-full">Stats</Button>
          </Link>
          <Link to="/likes" className="w-full">
            <Button variant="outline" className="w-full">Likes</Button>
          </Link>
          <Link to="/settings" className="w-full">
            <Button variant="outline" className="w-full">Settings</Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
