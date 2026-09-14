export default function AnnounceBar() {
  return (
    <div className="bg-tile text-xs leading-4 text-center py-2 px-4">
      <span className="hidden md:inline">
        Made to order in London. UK delivery included. Ships in 12 working days.
      </span>
      <span className="md:hidden">Made in London. UK delivery included.</span>
    </div>
  )
}
