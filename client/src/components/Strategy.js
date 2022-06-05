import { useState } from "react";

const Strategy = () => {

    const [items, setItems] = useState([
        {
            title: "If statement"
        },
        {
            title: "metric"
        },
        {
            title: "period"
        }
])

    return(
        <div>
            <div>Buy strategy</div>
            <div>
                {
                    items.map(
                        item => {
                            return (
                                <p>{item.title}</p>
                            )
                        }
                    )
                }
            </div>
            <div>Add more entry conditions</div>
            <div>Sell strategy</div>
            <div>% change</div>
            <div>sum of</div>
            <div>difference</div>
            <div>Period: rolling/day to day/week to week/month to month</div>
            <div>
                <p>Leverage</p>
                <p>Options</p>
            </div>
        </div>
    )
}

export default Strategy;