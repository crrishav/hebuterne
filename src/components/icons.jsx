export function MenuIcon({ className = '', ...rest }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`w-5 h-5 fill-none stroke-current ${className}`}
      strokeWidth="1"
      strokeLinecap="square"
      {...rest}
    >
      <path d="M3 5.5h14M3 10h14M3 14.5h14" />
    </svg>
  )
}

export function CloseIcon({ className = '', ...rest }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`w-5 h-5 fill-none stroke-current ${className}`}
      strokeWidth="1"
      strokeLinecap="square"
      {...rest}
    >
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  )
}

export function SearchIcon({ className = '', ...rest }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`w-5 h-5 fill-none stroke-current ${className}`}
      strokeWidth="1"
      strokeLinecap="square"
      {...rest}
    >
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="M13 13l4.5 4.5" />
    </svg>
  )
}

export function ChevronIcon({ className = '', ...rest }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`w-4 h-4 fill-none stroke-current ${className}`}
      strokeWidth="1"
      strokeLinecap="square"
      {...rest}
    >
      <path d="M5 8l5 5 5-5" />
    </svg>
  )
}

export function BagIcon({ className = '', ...rest }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`w-5 h-5 fill-none stroke-current ${className}`}
      strokeWidth="1"
      strokeLinecap="square"
      {...rest}
    >
      <path d="M4.5 6.5h11l.5 10h-12z" />
      <path d="M7 6.5V5a3 3 0 0 1 6 0v1.5" />
    </svg>
  )
}
