import '../assets/styles/GamerLandingPage.css';
var Scroll   = require('react-scroll');
var scroller = Scroll.scroller;

const GamerLandingPage = () => {

    // Use this design library
    // https://mui.com/material-ui/getting-started/installation/

    // image from
    // https://unsplash.com/photos/S2YQjZWYnEE
    // https://unsplash.com/photos/rN1y-_EV8kE

    function handleClick() {
        scroller.scrollTo('Game', {
            smooth: true,
        } )
    }

    return(
        <div className='gamer-landing-page'>
            <div className='spacer'>

            </div>
            <div className="row body-pd ">
                <div className="col-5 d-flex flex-column justify-content-center">
                    <div className='landing-h1'>
                        Buy Low
                    </div>
                    <div className='landing-h1'>
                        Sell High
                    </div>
                    <div className='col-10 landing-p pt-2 pb-2'>
                        Put your stocks trading skills to test.Spice up your trading instinct with trading game by Tradeor. Test your skills/luck trading on SPX500, APPL, TSLA and many more.
                    </div>
                    <div className="row">
                        <div className="col-6 pt-4">
                            <button className="landing-btn" onClick={handleClick}>
                                <span>Play now</span>
                                <span class="material-icons">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-7">
                    <img src={require('../assets/images/banner-1.jpg')} className="landing-banner"/>
                </div>
            </div>
        </div>
    )

}

export default GamerLandingPage;