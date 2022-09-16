import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import '../assets/styles/Gamer.css';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { InfinitySpin } from  'react-loader-spinner'
import Modal from 'react-modal';
import { PerformanceCard } from "./PerformanceCard";

Modal.setAppElement('#root');

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

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

    const stocksArray = [
        {
            "name": "S&P 500",
            "code": "SPY"
        }, 
        {
            "name": "Apple Inc",
            "code": "AAPL"
        },
        {
            "name": "Tesla Inc",
            "code": "TSLA"
        },
        {
            "name": "Shopify Inc",
            "code": "SHOP"
        },
        {
            "name": "Advanced Micro Devices, Inc",
            "code": "AMD"
        },
        {
            "name": "Walmart Inc",
            "code": "WMT"
        }
    ]
    
    const [dataSeries, setDataSeries] = useState([])

    const [modalIsOpen, setIsOpen] = useState(false);

    const [displayStart, setDisplayStart] = useState(true)

    const [buySellLevel, setBuySellLevel] = useState([])

    const [ticker, setTicker] = useState("SPY")

    const [cash, setCash] = useState(1000)

    const [noOfStocks, setNoOfStocks] = useState(0)

    const [marketValue, setMarketValue] = useState(0)

    const [period, setPeriod] = useState(0)

    var gameState = "Stop"

    const ref = useRef();

    const startButtonRef = useRef();

    const stopButtonRef = useRef();

    var newX, newY;

    var buySellPoints = [];

    let startGame = d3.select("#start-game");
    let reviewGame = d3.select("#review-game");
    let buy = d3.select("#buy");
    let sell = d3.select("#sell");
    let trading = "";

    // Calc average given an array of numbers
    function average(arr) {
        let sum = 0
        for(let i = 0; i< arr.length; i++) {
            sum += arr[i]
        }
        return sum / arr.length
    }
    
    const renderChart = async (domSVG) => {

        let zoom, chartBody, height, width, margin, interval;
        var startI, endI, midI;

        // Target the svg in the Dom
        const svg = d3.select(domSVG)

        // Clean the canvas first
        svg.selectAll("*").remove();

        // Append g to be used as x axis
        var xAxis = svg.append("g")
        xAxis.attr("class", "x-axis")

        // Append another g to be used as y-axis
        var yAxis = svg.append("g")
        yAxis.attr("class", "y-axis")

        // Set the margin that will be used to position the x-axis and y-axis
        height = 600;
        width = window.innerWidth / 1.8;
        margin = { top: 20, right: 30, bottom: 30, left: 40 };
    
        // Define the characteristic/feature of axis x (domain, width & position)
        var x = d3.scaleTime()
        .domain(d3.extent(dataSeries, function(d) { return d.date; }))
        .range([ 0, width - margin.right])

        const offsetX = height - margin.bottom
        const offsetY = 0 - margin.bottom - 10

        // Define the characteristic/feature of axis y (domain, height & position)
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
        
        // Append svg element with the svg clipath created above as boundary
        chartBody = svg.append("g")
        .attr("clip-path", "url(#clip)")

        // define axis generator to create the actual x-axis 
        let xAxisGenerator = d3.axisBottom(x)
        xAxisGenerator.tickFormat(d3.timeFormat("%b %Y"))

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
        .scaleExtent([1, 30])  // This control how much you can unzoom (x0.5) and zoom (x30)
        .translateExtent([[0, 0], [width, height]]) // This control how much you can move the x-axis and y-axis.
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
        .on("wheel.zoom", null) // Disable zoom due to wheeling
        .on("dblclick.zoom", null); // Disable zoom due to dbl click

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

        startGame.on("click", function(e) {

            //Set interval to move axis to the right
            interval = setInterval(function(){
                zoom.translateBy(chartBody.select("rect"), -1, 0, [30, height - 10]);
                // setTimer(timer => timer + 1)
            }, 100)

            gameState = "Start"
            setDisplayStart(false)
            // programmatically trigger zoom event (can be done either by translateBy, scaleBy etc)
            // zoom.translateBy(chartBody.select("rect"), -1, 0, [30, height - 10]);
        });

        reviewGame.on("click", function() {
            clearInterval(interval);
            gameState = "Stop"
            setDisplayStart(true)
        });

        // Detect keydown event
        document.addEventListener("keydown", function(event) {
            if(gameState === "Start") {
                if (event.keyCode == 13) {
                    trading = "Sell"
                    setNoOfStocks(noOfStocks => {
                        if((noOfStocks - 1) >= 0) {
                            setCash(cash => cash + dataSeries[endI]["close"])
                            buySellPoints.push({ "type": "sell", "close": dataSeries[endI]["close"], "date": dataSeries[endI]["date"]})
                            setBuySellLevel(buySellLevel => buySellPoints)
                            return noOfStocks - 1
                        } else {
                            alert("You don't have enough stocks to sell.")
                            return noOfStocks
                        }
                    })
                    
                } else if(event.keyCode == 32) {
                    trading = "Buy"
                    setCash(cash => {
                        if((cash - dataSeries[endI]["close"]) >= 0 ) {
                            setNoOfStocks(noOfStocks => noOfStocks + 1)
                            buySellPoints.push({ "type": "buy", "close": dataSeries[endI]["close"], "date": dataSeries[endI]["date"]})
                            setBuySellLevel(buySellLevel => buySellPoints)
                            return cash - dataSeries[endI]["close"]
                        } else {
                            alert("You don't have enough cash to buy.")
                            return cash
                        }
                    })
                    
                }
            } else {
                alert("Start the game first!")
            }
        });


        // Set the line animation effect
        // path
        // .attr("stroke-dasharray", totalLength + " " + totalLength)
        // .attr("stroke-dashoffset", totalLength)
        // .transition() // Call Transition Method
        // .duration(5000) // Set Duration timing (ms)
        // .ease(d3.easeLinear) // Set Easing option
        // .attr("stroke-dashoffset", totalLength * 2)

        // Create the g element to hold buy/sell entry points
        chartBody.append("g")
        .attr("class", "circle-plot")
    
        // zoom function handler
        function draw() {

                var node = this;
                
                // Retrieve the zoom event
                // Zoom event has x, y and k (relationship: Xn = X(0,0) + kX; Yn = Y(0,0) + kY)
                newX = d3.zoomTransform(node)

                // Set the y of zoom event to 0 because we only want x-direction to move, leaving y-direction unaffected
                // zoom event by default will adjust the graph in x-direction and y-direction when using rescaleX and rescaleY
                // Remember zooming is basically as moving the plot area either horizontally or vertically or both
                newX.y = 0

                // Calculate range of y-axis domain
                startI = dataSeries.length - 1 - Math.floor(((newX.x) / -23200) * dataSeries.length)
                endI = Math.floor(startI - (-(width)/ -23200) * dataSeries.length)
                midI = Math.floor((startI + endI) / 2)

                // if reach the end of data, clear interval to stop the game
                if(endI < 0) {
                    clearInterval(interval)
                    return;
                }
                
                // Else, re-calculate the domain of y-axis 
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

                // clear all previous buy sell points
                chartBody.select(".circle-plot").selectAll("*").remove();

                // update buy sell points
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

        // Zoom in the graph to the max after loading the initial data
        zoom.scaleBy(chartBody.select("rect"), 30, [0, height]);

    }

    // Handler function when you select a new ticker
    const handleTickerSubmit = () => {
        setIsOpen(modalIsOpen => true)
        axios.post(`${process.env.REACT_APP_API_URL}ticker`, {
            "ticker": ticker,
        })
        .then(response => {
            if(response.status === 200 ) {
                setDataSeries(response.data.series.map(sample => { 
                    return {"date": new Date(sample.date), "close": sample.close, "ticker": sample.symbol, "volume": sample.volume}
                }))
            }
            setIsOpen(modalIsOpen => false)
        })
        .catch(error => {
            alert("Invalid ticker!")
            setIsOpen(modalIsOpen => false)
        })
    }

    // get latest data
    // Additional function after re-rendering put here
    useEffect(() => {
        renderChart(ref.current)
    }, [dataSeries])

    useEffect(() => {
        handleTickerSubmit()
    }, [ticker])

    return (
        <div id="game-wrapper" className="body-pd">
            <OwlCarousel className='owl-theme' loop={false} rewind={true} margin={10} items={4} 
            autoplay={true} dots={false} autoplayTimeout={3000} >
                {
                    
                    stocksArray.map(function(item) {
                        return (
                                <div onClick={() => setTicker(item.code)} className="stocks-card d-flex flex-row align-items-center">
                                    <div className="stocks-card-logo">
                                        <img src={`/icons/${item.code}.png`} className="stocks-card-logo-image"/>
                                    </div>
                                    <div className="stocks-card-name">
                                        <div>
                                            {item.name}
                                        </div>
                                        <div>
                                            {item.code}
                                        </div> 
                                    </div>
                                    <div className="stocks-card-today d-flex flex-column align-items-center">
                                        <div>
                                            $800
                                        </div>
                                        <div className="d-flex flex-row justify-content-center">
                                            <label>
                                                <span class="material-icons icon-green">trending_up</span>
                                            </label>
                                            <label>
                                                +5.34%
                                            </label>
                                        </div>
                                    </div>
                                </div>
                        )
                    })

                }    
            </OwlCarousel>
            <div className="py-4">
            </div>
            <div>
                <div className="row">
                    <div className="col-9">
                        <svg ref={ref}>
                            <g></g>
                            <g className="x-axis"></g>
                            <g className="y-axis"></g>
                        </svg>
                    </div>
                    <div className="col-3">
                        <button className={displayStart ? "display-show" : "display-hide"} id="start-game">Start Game</button>
                        <button className={displayStart ? "display-hide" : "display-show"} id="review-game">Stop Game</button>
                        <div>
                            <p> {period} </p>
                        </div>
                        <div>
                            <PerformanceCard 
                                key="Total Profit ($)"
                                value={ Math.round(((marketValue * noOfStocks + cash - 1000) * 100 * 100))/ 10000  }
                            />
                            <PerformanceCard 
                                key="Cash ($)"
                                value={ Math.round(((cash ) * 100 * 100))/ 10000  }
                            />
                            <PerformanceCard 
                                key="Net worth ($)"
                                value={ Math.round(((marketValue * noOfStocks + cash ) * 100 * 100))/ 10000  }
                            />
                            <PerformanceCard 
                                key={`No. of ${ticker} stock holdings`}
                                value={noOfStocks}  
                            />
                        </div>
                        <div className="instructions-card">
                            <div className="d-flex">
                                <label className="bold">
                                    Instructions
                                </label>
                                <label>
                                    <span class="material-icons">chevron_right</span>
                                </label>
                            </div>
                            <div className="instruction">
                                1. Click "Start Game" to play.
                            </div>
                            <div className="instruction">
                                2. Click "Space" to buy and "Enter" to sell.
                            </div>
                            <div className="instruction">
                                3. Play until the end and see how much you made!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
            isOpen={modalIsOpen}
            style={customStyles}
            preventScroll={true}
            >
                <InfinitySpin 
                width='200'
                color="#4fa94d"
                />
            </Modal>
        </div>
    )
}

export default Gamer;