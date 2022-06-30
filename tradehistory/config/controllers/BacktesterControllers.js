var yahooFinance = require('yahoo-finance');

const getChart =  (req, res) => {

    const { ticker } = req.body

    yahooFinance.historical({
        symbol: ticker,
        from: '2010-01-01',
        to: new Date(),
        period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
      }, function (err, quotes) {
        if(err) {
            return res.status(400)
        }
        console.log(quotes)
        return res.status(200).send({
            "series": quotes
        })
      });

}

module.exports.getChart  = getChart;