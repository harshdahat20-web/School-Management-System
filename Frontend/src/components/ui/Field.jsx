export function Field({ label, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="block text-sm font-medium text-ink-700 mb-1.5">{label}</span>
      )}
      {children}
    </label>
  )
}

export function Input({ icon: Icon, className = '', ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500"
        />
      )}
      <input
        className={`w-full bg-white border border-ink-300 rounded-lg py-2.5 text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 ${
          Icon ? 'pl-9 pr-3' : 'px-3'
        } ${className}`}
        {...props}
      />
    </div>
  )
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`w-full bg-white border border-ink-300 rounded-lg px-3 py-2.5 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full bg-white border border-ink-300 rounded-lg px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 min-h-[90px] resize-none ${className}`}
      {...props}
    />
  )
}
