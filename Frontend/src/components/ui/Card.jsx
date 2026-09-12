export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl2 border border-ink-100 shadow-card ${className}`}>
      {children}
    </div>
  )
}
