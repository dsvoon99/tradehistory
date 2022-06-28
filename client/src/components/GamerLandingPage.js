import '../GamerLandingPage.css';

const GamerLandingPage = () => {

    // Use this design library
    // https://mui.com/material-ui/getting-started/installation/

    // image from
    // https://unsplash.com/photos/S2YQjZWYnEE
    // https://unsplash.com/photos/rN1y-_EV8kE

    return(
        <div className="container">
            <div className="row">
                <div className="col-4 d-flex flex-column justify-content-center">
                    <p className='landing-h1'>
                        #1 - Put your  
                    </p>
                    <p className='landing-h1'>
                        stock trading 
                    </p>
                    <p className='landing-h1'>
                        skills to test.
                    </p>
                    <div className='col-10 landing-p pt-2 pb-2'>
                        Spice up your trading instinct with Cerence's developed trading game. Test your skills/luck trading on SPX500, APPL, TSLA and many more.
                    </div>
                    <div className="row">
                        <div className="col-6 pt-4">
                            <button className="landing-btn">
                                <span>Play now</span>
                                <span class="material-icons">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-8">
                    <img src={require('../assets/banner-1.jpg')} className="landing-banner"/>
                </div>
            </div>
        </div>
    )

}

export default GamerLandingPage;