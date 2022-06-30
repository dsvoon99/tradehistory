import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import Strategy from "./Strategy";

const Gamer = () => {

    Array.prototype.hasMax = function(attrib) {
        return this.reduce(function(prev, curr) {
            return prev[attrib] < curr[attrib] ? curr : prev;
        });
    };

    Array.prototype.calcAverage = function(attrib, startIndex, endIndex) {
        let sum = 0;
        for (let i = startIndex; i < endIndex; i++) {
            sum += this[i][attrib]
        }
        return sum / (endIndex - startIndex)
    };

    const [dataSeries, setDataSeries] = useState([])

    const [buySellLevel, setBuySellLevel] = useState([])

    const [ticker, setTicker] = useState("AAPL")

    const [cash, setCash] = useState(1000)

    const [noOfStocks, setNoOfStocks] = useState(0)

    const [marketValue, setMarketValue] = useState(0)

    const [period, setPeriod] = useState(0)

    var gameState = "Stop"

    const ref = useRef();

    var newX, newY;

    var buySellPoints = [];

    let startGame = d3.select("#start-game");
    let reviewGame = d3.select("#review-game");
    let buy = d3.select("#buy");
    let sell = d3.select("#sell");
    let trading = "";

    const renderChart = async (domSVG) => {

        let zoom, chartBody, height, width, margin, interval;
        var startI, endI, midI;

        // Target the svg in the Dom
        const svg = d3.select(domSVG)

        // Set the margin that will be used to position the x-axis and y-axis
        height = 600;
        width = 1000;
        margin = { top: 20, right: 30, bottom: 30, left: 40 };
    
        // Define the characteristic/feature of axis x
        var x = d3.scaleTime()
        .domain(d3.extent(dataSeries, function(d) { return d.date; }))
        .range([ 0, width - margin.right])

        const offsetX = height - margin.bottom
        const offsetY = 0 - margin.bottom - 10

        // efine the characteristic/feature of axis y
        var maxDomain = dataSeries.hasMax("close")["close"]
        var y = d3.scaleLinear()
        .domain( [0, Math.ceil(maxDomain / 100) * 100])
        .range([ height + offsetY , 0 ]);

        // Set svg clippath to use as boundary for plot area
        var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("id", "clip-rect")
        .attr("x", "40")
        .attr("y", "0")
        .attr("width", width)
        .attr("height", height - margin.bottom);
        
        // Append svg element with the svg clipath created above as booundary
        chartBody = svg.append("g")
        .attr("clip-path", "url(#clip)")

        // define axis generator to create the actual x-axis 
        let xAxisGenerator = d3.axisBottom(x)
        xAxisGenerator.tickFormat(d3.timeFormat("%b"))
        xAxisGenerator.ticks(30)

        // define axis generator to create the actual y-axis 
        let yAxisGenerator = d3.axisLeft(y)

        // .call(axisGenerator) will attach the actual axis generated to the selected g
        svg.select(".x-axis")
        .attr("transform", "translate(" + margin.left +"," + offsetX + ")")
        .call(xAxisGenerator)

        svg.select(".y-axis")
        .attr("transform", "translate(" + margin.left +", 10)")
        .call(yAxisGenerator)

        // Define zooming characteristics
        zoom = d3.zoom()
        .scaleExtent([1, 30])  // This control how much you can unzoom (x0.5) and zoom (x20)
        .translateExtent([[0, 0], [width, height]])
        // Once attached(called) on svg, whenever there is a wheeling/scrolling/dblclick/programmaticalled triggered event (like scaleby, translateBy etc), draw() will be called
        .on("zoom", draw)

        // Add rect cover (as the surface to detect zoom aka scrolling/wheeling/dbclick) on the graph and attach zoom event.
        chartBody.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom)
        .on("wheel.zoom", null)
        .on("dblclick.zoom", null);

        // Append the path line with data
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
        
        // Get total no. of points on the line
        let totalLength = path.node().getTotalLength();


        startGame.on("click", function() {

            //Set interval to move axis to the right
            interval = setInterval(function(){
                zoom.translateBy(chartBody.select("rect"), -1, 0, [30, height - 10]);
                // setTimer(timer => timer + 1)
            }, 100)

            gameState = "Start"

            // programmatically trigger zoom event (can be done either by translateBy, scaleBy etc)
            // zoom.translateBy(chartBody.select("rect"), -1, 0, [30, height - 10]);
        });

        reviewGame.on("click", function() {
            //Set interval to move axis to the right
            // this.setInterval(() => {
            //     zoom.translateTo(chartBody.select("rect"), 30, 0, [30, height - 10]);
            // }, 1000)
            // programmatically trigger zoom event (can be done either by translateBy, scaleBy etc)
            //zoom.translateBy(chartBody.select("rect"), 1, 0, [30, height - 10]);
            //zoom.scaleBy(chartBody.select("rect"), 0, [0, height]);
            clearInterval(interval);

            gameState = "Stop"
        });

        buy.on("click", function() {
            //Set interval to move axis to the right
            // this.setInterval(() => {
            //     zoom.translateTo(chartBody.select("rect"), 30, 0, [30, height - 10]);
            // }, 1000)
            // programmatically trigger zoom event (can be done either by translateBy, scaleBy etc)
            zoom.translateBy(chartBody.select("rect"), 1, 0, [30, height - 10]);

            // rescale x axis

            // plot/udpate the graphs
        });

        document.addEventListener("keydown", function(event) {
            if(gameState == "Start") {
                if (event.keyCode == 13) {
                    trading = "Sell"
                    setCash(cash => cash + dataSeries[endI]["close"])
                    setNoOfStocks(noOfStocks => noOfStocks - 1)
                    buySellPoints.push({ "type": "sell", "close": dataSeries[endI]["close"], "date": dataSeries[endI]["date"]})
                    setBuySellLevel(buySellLevel => buySellPoints)
                } else if(event.keyCode == 32) {
                    trading = "Buy"
                    setCash(cash => cash - dataSeries[endI]["close"])
                    setNoOfStocks(noOfStocks => noOfStocks + 1)
                    buySellPoints.push({ "type": "buy", "close": dataSeries[endI]["close"], "date": dataSeries[endI]["date"]})
                    setBuySellLevel(buySellLevel => buySellPoints)
                }
            } else {
                alert("Start the game first!")
            }
        }, false);

        chartBody.append("g")
        .attr("class", "circle-plot")

        // Set the line animation effect
        // path
        // .attr("stroke-dasharray", totalLength + " " + totalLength)
        // .attr("stroke-dashoffset", totalLength)
        // .transition() // Call Transition Method
        // .duration(5000) // Set Duration timing (ms)
        // .ease(d3.easeLinear) // Set Easing option
        // .attr("stroke-dashoffset", totalLength * 2)
        
        // Calc average given an array of numbers
        function average(arr) {
            let sum = 0
            for(let i = 0; i< arr.length; i++) {
                sum += arr[i]
            }
            return sum / arr.length
        }

        // zoom function handler
        function draw() {

                var node = this;
                
                // Retrieve the zoom event
                // Zoom event has x, y and k (relationship: Xn = X(0,0) + kX; Yn = Y(0,0) + kY)
                newX = d3.zoomTransform(node)

                console.log(newX)

                // Set the y of zoom event to 0 because we only want x-direction to move, leaving y-direction unaffected
                // zoom event by default will adjust the graph in x-direction and y-direction when using rescaleX and rescaleY
                // Remember zooming is basically as moving the plot area either horizontally or vertically or both
                newX.y = 0

                // Calculate range of y-axis domain
                startI = dataSeries.length - 1 - Math.floor(((newX.x) / -29000) * dataSeries.length)
                endI = Math.floor(startI - (-(width)/ -29000) * dataSeries.length)
                midI = Math.floor((startI + endI) / 2)

                console.log(startI, endI, midI, dataSeries.length)

                // clear interval
                if(endI < 0) {
                    clearInterval(interval)
                    return;
                }
                
                // Reassign y-axis based on new domain
                y = d3.scaleLinear()
                .domain([
                    average([Math.ceil(dataSeries[midI]["close"]), Math.ceil(dataSeries[startI]["close"]), 
                    Math.ceil(dataSeries[endI]["close"])]) * 0.65, 
                average([Math.ceil(dataSeries[midI]["close"]), Math.ceil(dataSeries[startI]["close"]), 
                Math.ceil(dataSeries[endI]["close"])]) * 1.45])
                .range([ height + offsetY , 0 ])

                // Regenerate and attach the new y-axis
                svg.select(".y-axis")
                .attr("transform", "translate(" + margin.left +", 10)")
                .call(d3.axisLeft(y))

                // Rescale x-axis characteristic according to the zoomed event (x position)
                newX = newX.rescaleX(x);

                // Regenrate & attach the new x axis
                svg.select(".x-axis")
                .attr("transform", "translate(" + margin.left +"," + offsetX + ")")
                .call(d3.axisBottom(newX))

                // update line position with new x-axis definition and y-axis definition
                chartBody.select(".stock-line")
                .attr("stroke-dasharray", 0)
                .attr("stroke-dashoffset", 0)
                .attr("d", d3.line()
                    .x(function(d) { return newX(d.date) })
                    .y(function(d) { return y(d.close)})
                    ) 

                // update buy sell points
                chartBody.select(".circle-plot").selectAll("*").remove();

                chartBody.select(".circle-plot")
                .selectAll(".line")
                .data(buySellPoints)
                .enter()
                .append("line")
                    .style("stroke", function(d) { return d.type == "buy" ? "lightgreen" : "red"; })
                    .style("stroke-width", 5)
                    .attr("x1", function(d) { return newX(d.date) } )
                    .attr("y1", function(d) { return y(d.close) - 50} )
                    .attr("x2", function(d) { return newX(d.date) } )
                    .attr("y2", function(d) { return y(d.close) + 50 } )
                    
                setMarketValue(marketValue => dataSeries[endI]["close"])
                setPeriod(period => dataSeries[endI]["date"].toDateString())

        }

        // Set the width and height of the canvas
        svg.attr("width", width)
        svg.attr("height", height)

        // Zoom in the graph to the max after loading the data
        zoom.scaleBy(chartBody.select("rect"), 30, [0, height]);

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

    // Additional function after re-rendering put here
    useEffect(() => {
        renderChart(ref.current)
    }, [dataSeries])

    return (
        <section id="Game" className="container">
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
                    </div>
                    <div className="col-4">
                        <button id="start-game">Start Game</button>
                        <button id="review-game">Stop Game</button>
                        <p>{noOfStocks}</p>
                        <div>
                            <p> {period} </p>
                            <p> TWRR : { Math.round(((marketValue * noOfStocks + cash - 1000) / 1000 ) * 100 * 100) / 100  } %</p>
                            Asset { marketValue * noOfStocks + cash }
                            <p> stock { marketValue * noOfStocks } </p>
                            <p> cash { cash } </p>
                            Liabilities/Equities 1000
                        </div>  
                        <div>
                            Transaction record
                        </div>  
                        <div>
                            {
                                buySellLevel.map(function(sample) {
                                    return (
                                        <div>
                                            {sample.close}
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div>
                            Instructions
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Gamer;