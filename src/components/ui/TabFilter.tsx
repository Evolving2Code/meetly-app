"use client";

type TabFilterProps = {
  items: Array<{ id: string; label: string }>;
  activeId: string;
  onChange: (id: string) => void;
};

export function TabFilter({ items, activeId, onChange }: TabFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = item.id === activeId;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`tab-pill ${active ? "tab-pill-active" : ""}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
