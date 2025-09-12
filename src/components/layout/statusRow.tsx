type StatusItem = {
  icon: React.ReactNode
  value: string | number
}

export default function StatusRow({ items }: { items: StatusItem[] }) {
  return (
    <div className="grid grid-cols-4 gap-2 px-2 py-1 text-sm">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1">
          {item.icon} {item.value}
        </div>
      ))}
    </div>
  )
}
