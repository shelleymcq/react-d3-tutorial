import { useEffect, useState, useRef } from "react";
import './App.css';
import * as d3 from "d3";


function App() {
  //  1] Setup Initial data and settings -------------//
  const initialData = [
    {
      name: "Car",
      value: 10,
    },
    {
      name: "Food",
      value: 3,
    },
    {
      name: "Telephone",
      value: 9,
    },
    {
      name: "Electricity",
      value: 7,
    },
    {
      name: "Cinema",
      value: 7,
    },
  ]

  // chart dimensions
  const width = 500;
  const height = 150;
  const padding = 20;
  const maxValue = 20; // hard-coded maximum data value

  const [chartData, setChartData] = useState(initialData)

  const svgRef = useRef() // used in step 5

  //  2] Setup random data generator and SVG canvas (in return) --//
  // just for the example, this would be the place for a data fetch
  const newData = () => chartData.map(
    function (d) {
      d.value = Math.floor(
        Math.random() * (maxValue + 1)
      )
      return d
    }
  )

  //  3] Setup functions for Scales ------------------//
  // want to run these functions when the data changes (useEffect hook)
  useEffect(
    () => {
      //x-scales (d3.scaleLinear for numbers, d3.scalePoint for strings)
      const xScale = d3.scalePoint()
        .domain(chartData.map( (d) => d.name))
        .range([(0 + padding), (width - padding)])  // our coordinates on the x-axis
        console.log('Start - End X', xScale('Car'), xScale('Cinema'))
      //y-scales
      //domain is min and max value, we need to dynamically go through our data to find max
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(chartData, function(d) {return d.value})])
        .range([(height - padding), (0 + padding)])
        console.log('Start - End Y', yScale(0), yScale(10))

  //  4] Setup functions to draw Lines ---------------//
      const line = d3.line()
        .x((d) => xScale(d.name))  // returns the x-coord of that value
        .y((d) => yScale(d.value))
        // soften line with some curvature to the line (type d3.curve will show all the options)
        .curve(d3.curveMonotoneX)
        console.log('chart draw commands', line(chartData))
        // the result of this needs to be injected into the d attribute of the path with useRef

  //  5] Draw line        ----------------------------//
      // svgRef will get hold of the DOM element, current will get the target object
      // select the path
      // attr will target the d
      // we can hard code the attribute, or use what's returned by a function (line for this one)
      d3.select(svgRef.current)
        .select('path')
        .attr('d', (value) => line(chartData))
        .attr('fill', 'none')
        .attr('stroke', 'white')

  //  6] Setup functions to draw X and Y Axes --------//
      const xAxis = d3.axisBottom(xScale)
      const yAxis = d3.axisLeft(yScale)

  //  7] Draw x and y Axes   -------------------------//
      // remove existing axis before drawing new chart
      d3.select('#xaxis').remove()
      // use transform to deal with padding
      d3.select(svgRef.current)
        .append('g')
        .attr('transform', `translate(0, ${height - padding})`)
        .attr('id', 'xaxis')
        .call(xAxis)

      d3.select('#yaxis').remove()
      // use transform to deal with padding
      d3.select(svgRef.current)
        .append('g')
        .attr('transform', `translate(${padding}, 0)`)
        .attr('id', 'yaxis')
        .call(yAxis)

  },[chartData]
  )


  // d="" d attribute to draw line
  // M (move) ex: 'M50,50 L100,150' = move to the coordinates 50 across and 50 down
  // L (draw a line) = line starts at 50, 50 and ends at 100, 150

  // <rect /> tag allows you to draw a rectangle
  // ex: <rect width='500' height='150' fill='blue' /> draws a big blue rectangle
  // with our line in it

  return (
    <div>
      <h1>The App</h1>
      <header>

      <svg id="chart" ref={svgRef} viewBox="0 0 500 150">
        <path d="" fill="none" stroke="white" strokeWidth="5" />
      </svg>

      <p>
        <button type="button" onClick={() => setChartData(newData())}>
          Click to refresh data
        </button>
      </p>
      </header>
    </div>
  );
}

export default App;
