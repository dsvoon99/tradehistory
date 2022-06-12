import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import Strategy from "./Strategy";

Array.prototype.hasMax = function(attrib) {
    return this.reduce(function(prev, curr) {
        return prev[attrib] < curr[attrib] ? curr : prev;
    });
};

const Backtester = () => {

    const [dataSeries, setDataSeries] = useState([])

    const [ticker, setTicker] = useState("AAPL")

    const [xDomain, setXDomain] = useState([])

    const ref = useRef();

    var newX, newY;

    var startI, midI, midI1, midI2, endI;

    var startVal, midVal, endVal;

    const renderChart = async (domSVG) => {
        const svg = d3.select(domSVG)
        
        const height = 500;
        const width = 1000;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };

        let today = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        let last1Y = dataSeries.slice(0, 365)
    
        // Define the characteristic/feature of axis x
        var x = d3.scaleTime()
        .domain(d3.extent(dataSeries, function(d) { return d.date; }))
        .range([ 0, width ])

        const offsetX = height - margin.bottom
        const offsetY = 0 - margin.bottom - 10

        // efine the characteristic/feature of axis y
        var maxDomain = dataSeries.hasMax("close")["close"]
        var y = d3.scaleLinear()
        .domain( [0, Math.ceil(maxDomain / 100) * 100])
        .range([ height + offsetY , 0 ]);

        var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("id", "clip-rect")
        .attr("x", "40")
        .attr("y", "0")
        .attr("width", width)
        .attr("height", height - margin.bottom);
        
        var chartBody = svg.append("g")
        .attr("clip-path", "url(#clip)")

        // .axisBottom() will create the axis object using the feature defined
        // define axis generator
        let xAxisGenerator = d3.axisBottom(x)
        xAxisGenerator.tickFormat(d3.timeFormat("%b %Y"))

        svg.select(".x-axis")
        .attr("transform", "translate(" + margin.left +"," + offsetX + ")")
        .call(xAxisGenerator)

        svg.select(".y-axis")
        .attr("transform", "translate(" + margin.left +", 10)")
        .call(d3.axisLeft(y))

        var zoom = d3.zoom()
        .scaleExtent([1, 30])  // This control how much you can unzoom (x0.5) and zoom (x20)
        .translateExtent([[0, 0], [width, height]])
        .on("zoom", draw)
        // Add rect cover the zoomed graph and attach zoom event.
        
        chartBody.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom)
        .on("wheel.zoom", null)
        .on("dblclick.zoom", null);

        var path = chartBody.append("path")
        .attr("class", "stock-line")
        .attr("transform", "translate(" + margin.left + ", 0)")
        .datum(dataSeries)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.date) })
            .y(function(d) { return y(d.close) })
            )   
        
        let totalLength = path.node().getTotalLength();

        let zoomIn = d3.select("#zoom_in");
        let zoomOut = d3.select("#zoom_out");
        let toLeft = d3.select("#left");
        let toRight = d3.select("#right");
        let reset = d3.select("#reset");

        zoomIn.on("click", function() {
            temp.attr("class", "button")
            zoom.scaleBy(chartBody.select("rect"), 1.05, [width - 30, height / 2]);
        });

        zoomOut.on("click", function() {
            temp.attr("class", "button")
            zoom.scaleBy(chartBody.select("rect"), 0.95, [width - 30, height / 2]);
        });

        toLeft.on("click", function() {
            temp.attr("class", "button")
            zoom.translateBy(chartBody.select("rect"), 10, 0);
        });

        toRight.on("click", function() {
            temp.attr("class", "button")
            zoom.translateBy(chartBody.select("rect"), -10, 0);
        });

        reset.on("click", function() {
            temp.attr("class", "reset")
            zoom.scaleBy(chartBody.select("rect"), 0, [width, 0]);
        });

        path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition() // Call Transition Method
            .duration(5000) // Set Duration timing (ms)
            .ease(d3.easeLinear) // Set Easing option
            .attr("stroke-dashoffset", totalLength * 2)
        
        let temp = d3.select("#temp")
        let temp2 = d3.select("#temp2")

        var lastX, lastY;

        function average(arr) {
            let sum = 0
            for(let i = 0; i< arr.length; i++) {
                sum += arr[i]
            }
            return sum / arr.length
        }

        function draw() {
                // recover the new scale
                var node = this;

                if (temp.attr("class") === "button") {

                    temp2.attr("class", "")
                    
                    newX = d3.zoomTransform(node)

                    lastX = newX.x
                    lastY = newX.Y
                    
                    newX.y = 0

                    console.log(d3.zoomTransform(node))
                    // newY = d3.zoomTransform(this).rescaleY(y);
                    startI =  dataSeries.length - Math.floor(((-newX.x)/ (width * newX.k)) * dataSeries.length) - 1
                    endI = Math.floor(startI - (((width - margin.left)/ (width * newX.k))) * dataSeries.length)
                    midI = Math.floor((startI + endI) / 2)
                    midI1 = Math.floor((startI + midI)/2)
                    midI2 = Math.floor((endI + midI)/2)

                    console.log("index", startI, endI)

                    startVal = dataSeries[startI]["close"]
                    endVal = dataSeries[endI]["close"]

                    console.log("value", startVal, endVal)

                    if (endVal > startVal) {
                        newY = d3.scaleLinear()
                        .domain([
                            Math.ceil(dataSeries[startI]["close"] < 1 ? 0 : average([Math.ceil(dataSeries[startI]["close"]), Math.ceil(dataSeries[midI1]["close"])]) * 0.55, 
                            average([Math.ceil(dataSeries[endI]["close"]), Math.ceil(dataSeries[midI2]["close"])]) * 1.3])  
                        .range([ height + offsetY , 0 ])
                    } else {
                        newY = d3.scaleLinear()
                        .domain([
                            Math.ceil(dataSeries[startI]["close"] < 1 ? 0 : average([Math.ceil(dataSeries[endI]["close"]), Math.ceil(dataSeries[midI2]["close"])]) * 0.55,
                            average([Math.ceil(dataSeries[startI]["close"]), Math.ceil(dataSeries[midI1]["close"])]) * 1.3, 
                        ])  
                        .range([ height + offsetY , 0 ])
                        
                    }

                    newX = newX.rescaleX(x);

                    // update axes with these new boundaries
                    svg.select(".x-axis")
                    .attr("transform", "translate(" + margin.left +"," + offsetX + ")")
                    .call(d3.axisBottom(newX))
                    
                    svg.select(".y-axis")
                    .attr("transform", "translate(" + margin.left +", 10)")
                    .call(d3.axisLeft(newY))   
                    chartBody.select(".stock-line")
                    .attr("stroke-dasharray", 0)
                    .attr("stroke-dashoffset", 0)
                    .attr("d", d3.line()
                        .x(function(d) { return newX(d.date) })
                        .y(function(d) { return  newY(d.close)})
                    ) 

                    // }

                } else if (temp.attr("class") === "reset") {

                    // update axes with these new boundaries
                    svg.select(".x-axis")
                    .attr("transform", "translate(" + margin.left +"," + offsetX + ")")
                    .call(xAxisGenerator)

                    svg.select(".y-axis")
                    .attr("transform", "translate(" + margin.left +", 10)")
                    .call(d3.axisLeft(y))

                    lastX = 0
                    lastY = 0

                    newY = null;
                    newX = null;

                    temp2.attr("class", "scroll-down")

                    // update circle position
                    chartBody.select(".stock-line")
                    .attr("stroke-dasharray", 0)
                    .attr("stroke-dashoffset", 0)
                    .attr("d", d3.line()
                        .x(function(d) { return x(d.date) })
                        .y(function(d) { return y(d.close)})
                        ) 
                }
        }
        svg.attr("width", width)
        svg.attr("height", height)

    }

    const handleTickerSubmit = () => {
        axios.post(`${process.env.REACT_APP_API_URL}ticker`, {
            "ticker": ticker,
        })
        .then(response => {
            if(response.status === 200 ) {
                setDataSeries(response.data.series.map(sample => { 
                    return {"date": new Date(sample.date), "close": sample.close, "ticker": sample.symbol, "volume": sample.volume}
                }))
            }
        })
        .catch(error => {
            alert("Invalid ticker!")
        })
    }

    useEffect(() => {
        renderChart(ref.current)
    }, [dataSeries])


    return (
        <div>
            <div>
                <label>Ticker: </label>
                <input value={ticker} onChange={event => setTicker(event.target.value)}/>
                <button onClick={handleTickerSubmit}>Submit</button>
            </div>
            <div>
                <div className="row">
                    <div className="col-8">
                        <svg ref={ref}>
                            <g></g>
                            <g className="x-axis"></g>
                            <g className="y-axis"></g>
                        </svg>
                        <div>
                            <button id="zoom_in">Zoom in</button>
                            <button id="zoom_out">Zoom out</button>
                            <button id="left">toLeft</button>
                            <button id="right">toRight</button>
                            <button id="reset">Reset Zoom</button>
                            <label id="temp"></label>
                            <label id="temp2"></label>
                        </div>
                    </div>
                    <div className="col-4">
                        <Strategy/> 
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Backtester;