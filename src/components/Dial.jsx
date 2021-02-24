import React from "react"
import * as d3 from "d3"
import { useIsVisible } from "react-is-visible"

function Dial(props) {
  const { min, max, value, width = 300, height = 300 } = props
  const padding = 20
  const numPoints = 100
  const transitionTime = 1000

  const valuePath = React.useRef(null)
  const dialIsVisible = useIsVisible(valuePath)
  const [valueNum, setValueNum] = React.useState(0)
  const [visible, setVisible] = React.useState(false)
  const [dialPoints, setDialPoints] = React.useState([])

  function getPosFromAngle(angle) {
    const xScale = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([padding, width - padding])
    const yScale = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([padding, height - padding])

    const x = xScale(Math.cos(angle))
    const y = yScale(Math.sin(angle))
    return [x, y]
  }

  React.useEffect(() => {
    const scale = d3
      .scaleLinear()
      .domain([0, numPoints - 1])
      .range([0.5 * Math.PI, 2.5 * Math.PI])

    const points = d3.range(numPoints).map(function (_, i) {
      const angle = scale(i)
      return getPosFromAngle(angle)
    })

    setDialPoints(points)
  }, [])

  React.useEffect(() => {
    const valueScale = d3
      .scaleLinear()
      .domain([0, numPoints - 1])
      .range([min, value])
    const angleScale = d3
      .scaleLinear()
      .domain([min, max])
      .range([0.5 * Math.PI, 2.5 * Math.PI])

    const points = d3.range(numPoints).map(function (_, i) {
      const angle = angleScale(valueScale(i))
      return getPosFromAngle(angle)
    })

    let line = d3.line()([getPosFromAngle(angleScale(0))])
    if (visible) {
      line = d3.line()(points)
    }

    const path = d3.select(valuePath.current).attr("d", line)
    const totalLength = path.node().getTotalLength()
    path
      .attr("stroke-dasharray", totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(transitionTime)
      .ease(d3.easePolyOut)
      .attr("stroke-dashoffset", 0)
  }, [visible])

  React.useEffect(() => {
    const intervalTime = transitionTime / 50
    const intervalNum = value / 50

    const nextValue = Math.min(valueNum + intervalNum, value)
    if (nextValue > value || !visible) return

    setTimeout(() => {
      setValueNum(nextValue)
    }, intervalTime)
  }, [visible, valueNum])

  React.useEffect(() => {
    if (dialIsVisible) {
      setVisible(true)
    }
  }, [dialIsVisible])

  return (
    <svg width={width} height={height}>
      <path
        className="dial-line"
        fill="none"
        strokeWidth={2}
        d={d3.line().curve(d3.curveNatural)(dialPoints)}
      ></path>
      <path
        className="value-line"
        fill="none"
        strokeWidth={2}
        ref={valuePath}
      ></path>

      <text
        className="highlight-feature sml"
        textAnchor="middle"
        fontSize={30}
        x={width / 2}
        y={height / 2 + 40}
      >
        / {max}
      </text>
      <text
        textAnchor="middle"
        className="highlight-feature lrg"
        x={width / 2}
        y={height / 2 + 10}
      >
        {valueNum.toFixed(0)}
      </text>
    </svg>
  )
}

export default Dial
