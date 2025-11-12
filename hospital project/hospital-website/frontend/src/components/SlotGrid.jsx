import React from 'react'

export default function SlotGrid({ slots = [], onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {slots.map((s) => (
        <button
          key={s.id}
          disabled={!s.available}
          onClick={() => onSelect(s)}
          className={`p-2 rounded text-sm ${s.available ? 'bg-white hover:bg-sky-50' : 'bg-slate-100 text-slate-400'} border`}
        >
          <div>{s.time}</div>
          {!s.available && <div className="text-xs">Unavailable</div>}
        </button>
      ))}
    </div>
  )
}
