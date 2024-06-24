import { useEffect, useState } from 'react';
import './App.css';

const RS = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
});
function SIPCalculator() {
  const [initialAmt, setInitialAmt] = useState(1500000)
  const [monthlyAmt, setMonthlyAmt] = useState(15000);
  const [interestRate, setInterestRate] = useState(15);
  const [numOfYears, setNumOfYears] = useState(15);
  const [inflationRate, setInflationRate] = useState(0);
  const [yearlyData, setYearlyData] = useState([]);
  const [maturityValue, setMaturityValue] = useState(0);

  useEffect(() => {
    const data = [];
    let totalInvested = initialAmt; // Initialize with the initial investment amount
    let adjustedMonthlyAmt = monthlyAmt;

    const monthlyInterestRate = interestRate / 12 / 100;
    const annualInflationAdjustment = 1 + inflationRate / 100;
    let prevYearlyInterest = 0
    let totalAmount = 0

    for (let year = 1; year <= numOfYears; year++) {
      const monthsInvested = year * 12;
      totalInvested += adjustedMonthlyAmt * 12;

      // Calculate the future value of the initial amount
      const FV_initial = initialAmt * Math.pow(1 + (interestRate / 100), year);

      // Calculate the future value of the adjusted monthly investments
      const FV_monthly = adjustedMonthlyAmt * ((Math.pow(1 + monthlyInterestRate, monthsInvested) - 1) / monthlyInterestRate) * (1 + monthlyInterestRate);

      let yearlyInterest = (FV_initial + FV_monthly) - (initialAmt + adjustedMonthlyAmt * monthsInvested);

      // Calculate the total amount at the end of the year including interest
      totalAmount = totalInvested + yearlyInterest;

      // For initial amount's interest to be adjust every year
      yearlyInterest -= prevYearlyInterest
      prevYearlyInterest = FV_initial - initialAmt

      data.push({
        year,
        monthlyAmt: adjustedMonthlyAmt,
        totalInvested: totalInvested,
        interest: yearlyInterest,
        maturityValue: totalAmount,
      });

      // Adjust the monthly amount for the next year by the inflation rate
      adjustedMonthlyAmt *= annualInflationAdjustment;
    }

    setMaturityValue(totalAmount);
    setYearlyData(data);
  }, [initialAmt, monthlyAmt, interestRate, numOfYears, inflationRate]);

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>SIP Calculator</h1>
          <div>
            <label>Initial Investment Amount</label>
            <input type="number" value={initialAmt.toString()} onChange={(e) => setInitialAmt(parseInt(e.target.value) || 0)} />
          </div>
          <div>
            <label>Monthly Investment Amount</label>
            <input type="number" value={monthlyAmt} onChange={(e) => setMonthlyAmt(parseInt(e.target.value) || 0)} />
          </div>
          <div>
            <label>Interest Rate (%)</label>
            <input type="number" value={interestRate} onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <label>Inflation Rate (%)</label>
            <input type="number" value={inflationRate} onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <label>Number of Years</label>
            <input type="number" value={numOfYears} onChange={(e) => setNumOfYears(parseInt(e.target.value) || 0)} />
          </div>
          <h2>Maturity Value: {RS.format(maturityValue)}</h2>
          <ul>
            {inflationRate ?
              (
                <>
                  <li>Even though the estimated rate of return is {interestRate}%, if inflation rate of {inflationRate}% is static, the real rate of interest is {(100*(interestRate-inflationRate)/(100+inflationRate)).toFixed(2)}%</li>
                <li>In {numOfYears} years, the monthly amount you can withdraw will be {RS.format(0.8333/100*maturityValue)}</li>
                <li>Adjusted for inflation provided, this amount will probably be equivalent to {RS.format(maturityValue * ((interestRate - inflationRate) / (100 + inflationRate) / 12))} in today's value</li>
                  <li>Try to increase your monthly investment amount so that it at least matches the current inflation rate.</li>
                </>
              ) :
              (
                <li>The maximum amount you can withdraw every month every year is {RS.format(0.8333/100*maturityValue)}</li>
              )
            }

          </ul>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Monthly Amount</th>
                <th>Total Invested</th>
                <th>Interest Amount</th>
                <th>Maturity Value</th>
              </tr>
            </thead>
            <tbody>
              {yearlyData.map(({ year, monthlyAmt, totalInvested, interest, maturityValue }) => (
                <tr key={year}>
                  <td>{year}</td>
                  <td>{RS.format(monthlyAmt)}</td>
                  <td>{RS.format(totalInvested)}</td>
                  <td>{RS.format(interest)}</td>
                  <td>{RS.format(maturityValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </header>
      </div>
    </>
  );
}

export default SIPCalculator;