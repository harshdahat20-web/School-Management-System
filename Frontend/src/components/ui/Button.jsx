const variants = {
  primary: 'bg-brand-500 hover:bg-brand-600 text-white',
  ghost: 'bg-white hover:bg-ink-100 text-ink-700 border border-ink-300',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  icon: Icon,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  )
}
