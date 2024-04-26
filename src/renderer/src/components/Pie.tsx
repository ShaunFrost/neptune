type CircleProps = {
  color: string
  percentage?: number
}

type TextProps = {
  percentage: number
}

const cleanPercentage = (percentage) => {
  const tooLow = !Number.isFinite(+percentage) || percentage < 0
  const tooHigh = percentage > 100
  return tooLow ? 0 : tooHigh ? 100 : +percentage
}

const Circle = ({ color, percentage = 100 }: CircleProps) => {
  const r = 25
  const circ = 2 * Math.PI * r
  const strokePct = ((100 - percentage) * circ) / 100
  return (
    <circle
      r={r}
      cx={50}
      cy={50}
      fill="transparent"
      stroke={strokePct !== circ ? color : ''}
      strokeWidth={'0.5rem'}
      strokeDasharray={circ}
      strokeDashoffset={percentage ? strokePct : 0}
      strokeLinecap="round"
    ></circle>
  )
}

const Text = ({ percentage }: TextProps) => {
  return (
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize={'0.8em'}
      fill="white"
    >
      {percentage.toFixed(0)}%
    </text>
  )
}

const Pie = ({ percentage, color }: CircleProps) => {
  const pct = cleanPercentage(percentage)
  return (
    <svg width={100} height={100}>
      <g transform={`rotate(-90 ${'50 50'})`}>
        <Circle color="lightgrey" />
        <Circle color={color} percentage={pct} />
      </g>
      <Text percentage={pct} />
    </svg>
  )
}

export default Pie
