export default function StatBadge({
  icon,
  iconBg = "bg-neutral",
  title,
  amount,
  stat,
  className = "",
  statClassName = "",
}) {
  return (
    <div
      className={`
        flex items-center gap-4
        rounded-2xl border border-base-content/20
        p-4 shadow-md hover:shadow-lg transition-shadow duration-300
        ${className}
      `}
    >
      {/* Icon */}
      <div
        className={`
          flex h-14 w-14 shrink-0 items-center justify-center
          rounded-full
          ${iconBg}
        `}
      >
        {icon}
      </div>

      {/* Text Content */}
      <div className="min-w-0 flex-1 flex flex-col gap-1 text-md">
        <p className="font-medium truncate text-neutral-900">{title}</p>

        <p className="font-bold truncate text-neutral-900">{amount}</p>

        <p className={`truncate ${statClassName || "text-neutral-500"}`}>
          {stat}
        </p>
      </div>
    </div>
  );
}
