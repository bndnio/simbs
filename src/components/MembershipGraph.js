import React from "react"
import * as d3 from "d3"

const MembershipGraph = ({ membership, width, height }) => {
  const strokeWidth = 6
  const fontSize = 20
  const offset = strokeWidth
  const [points, setPoints] = React.useState([])
  const [prePoint, setPrePoint] = React.useState([])

  React.useEffect(() => {
    const years = membership.map((m) => m.year)
    const nums = membership.map((m) => m.num)

    const xScale = d3
      .scaleLinear()
      .domain([Math.min(...years) - 0.25, Math.max(...years)])
      .range([0, width - offset * 4])
    const yScale = d3
      .scaleLinear()
      .domain([Math.max(...nums), Math.min(...nums)])
      .range([0 + offset, height - 2 * offset])

    const xPoints = years.map((x) => xScale(x))
    const yPoints = nums.map((y) => yScale(y))

    setPoints(d3.zip(xPoints, yPoints))

    const firstMembership = membership[0]
    const { year: firstYear, num: firstNum } = firstMembership

    const firstXPoint = xScale(firstYear - 0.25)
    const firstYPoint = yScale(firstNum * 0.95)

    setPrePoint([firstXPoint, firstYPoint])
  }, [width])

  return (
    <svg className="membership-graph" width={width} height={height}>
      <path
        className="line"
        fill="none"
        strokeWidth={strokeWidth}
        d={d3.line().curve(d3.curveMonotoneX)([prePoint, ...points])}
      ></path>
      {points.length &&
        membership.map((m, i, arr) => {
          const xOffset = 35
          const yOffset = height / 5

          let [x, y] = points[i]
          const above = y + yOffset * 2 < height

          let line0X = x
          let line0Y = above ? y + strokeWidth * 1.5 : y - strokeWidth * 1.5
          let line1X = above ? x - xOffset : x + xOffset
          let line1Y = above
            ? y + yOffset - fontSize / 2
            : y - yOffset + fontSize / 2
          let textX = above ? x - xOffset : x + xOffset
          let textY = above ? y + yOffset + fontSize : y - yOffset
          return (
            <>
              <path
                fill="none"
                strokeWidth={strokeWidth / 2}
                d={d3.line().curve(d3.curveNatural)([
                  [line0X, line0Y],
                  [
                    (line0X + line1X) / 2 +
                      Math.abs(line0X - line1X) * (!above ? -0.2 : 0.2),
                    (line0Y + line1Y) * 0.5,
                  ],
                  [line1X, line1Y],
                ])}
              ></path>
              <text
                alignmentBaseline={above ? "bottom" : "top"}
                textAnchor="middle"
                fontSize={fontSize}
                x={textX}
                y={textY}
              >
                {m.year}: {m.num}
                {i === arr.length - 1 ? "*" : ""}
              </text>
            </>
          )
        })}
    </svg>
  )
}

export default MembershipGraph
