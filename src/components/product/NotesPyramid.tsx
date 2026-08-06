export function NotesPyramid({
  top,
  middle,
  base,
}: {
  top: string[];
  middle: string[];
  base: string[];
}) {
  const rows = [
    { label: "Top Notes", notes: top },
    { label: "Heart Notes", notes: middle },
    { label: "Base Notes", notes: base },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {rows.map((row) => (
        <div key={row.label} className="glass-light rounded-lg p-6 text-center">
          <p className="eyebrow text-gold">{row.label}</p>
          <p className="mt-3 font-display text-lg">{row.notes.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
