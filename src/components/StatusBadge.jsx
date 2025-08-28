 const STATUS_COLORS = {
  Pending:     "#9CA3AF",
  "To Do":     "#3B82F6",
  "In Progress":"#F59E0B",
  "In Review": "#8B5CF6",
  Done:        "#10B981",
};

 const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};

export default function StatusBadge({ label }) {
  const hex = STATUS_COLORS[label] ?? "#6B7280"; 
  const [r, g, b] = hexToRgb(hex);

   const style = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "0.35rem 0.65rem",
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.12)`,
    color: `rgb(${r}, ${g}, ${b})`,
    border: `1px solid rgba(${r}, ${g}, ${b}, 0.28)`,
    borderRadius: 999,
    fontWeight: 600,
    lineHeight: 1,
  };

  const dotStyle = {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: `rgb(${r}, ${g}, ${b})`,
  };

  return (
    <span className="status-badge" style={style} aria-label={`Status: ${label}`}>
      <span aria-hidden style={dotStyle} />
      {label}
    </span>
  );
}
