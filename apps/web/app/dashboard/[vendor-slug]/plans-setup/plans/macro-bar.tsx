'use client'

interface MacroBarProps {
  protein: number
  carbs: number
  fat: number
  size?: 'sm' | 'md'
}

export function MacroBar({ protein, carbs, fat, size = 'md' }: MacroBarProps) {
  const total = protein + carbs + fat
  if (total === 0) return null

  const h = size === 'sm' ? 'h-7' : 'h-9'
  const text = size === 'sm' ? 'text-[11px]' : 'text-[12px]'

  return (
    <div className={`flex ${h} w-full overflow-hidden rounded-lg`}>
      {protein > 0 && (
        <div
          className={`flex items-center justify-center ${text} font-medium text-white`}
          style={{ width: `${(protein / total) * 100}%`, backgroundColor: '#5B8C7A' }}
        >
          Protein<span className="ml-1 opacity-80">{protein} %</span>
        </div>
      )}
      {carbs > 0 && (
        <div
          className={`flex items-center justify-center ${text} font-medium text-white`}
          style={{ width: `${(carbs / total) * 100}%`, backgroundColor: '#D4956A' }}
        >
          Carbs<span className="ml-1 opacity-80">{carbs} %</span>
        </div>
      )}
      {fat > 0 && (
        <div
          className={`flex items-center justify-center ${text} font-medium text-white`}
          style={{ width: `${(fat / total) * 100}%`, backgroundColor: '#C96B6B' }}
        >
          Fat<span className="ml-1 opacity-80">{fat} %</span>
        </div>
      )}
    </div>
  )
}

/** Small inline pills for the table view */
export function MacroPills({ protein, carbs, fat }: { protein: number; carbs: number; fat: number }) {
  if (protein === 0 && carbs === 0 && fat === 0) {
    return <span className="text-[12px] text-gray-300">Not set</span>
  }
  return (
    <div className="flex items-center gap-1">
      <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium text-white" style={{ backgroundColor: '#5B8C7A' }}>
        <span className="mr-0.5 text-[10px] opacity-70">P</span>{protein}
      </span>
      <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium text-white" style={{ backgroundColor: '#D4956A' }}>
        <span className="mr-0.5 text-[10px] opacity-70">C</span>{carbs}
      </span>
      <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium text-white" style={{ backgroundColor: '#C96B6B' }}>
        <span className="mr-0.5 text-[10px] opacity-70">F</span>{fat}
      </span>
    </div>
  )
}
