import "./styles.css";

const betFormElem = document.querySelector("#betForm");

const randomInt = max => Math.floor(Math.random() * Math.floor(max));

const isIterationWin = (iteration, winEveryNbet, isRandom) => {
  if (isRandom === true) {
    return iteration % winEveryNbet === randomInt(winEveryNbet);
  } else {
    return iteration % winEveryNbet === 0;
  }
};

const performCounting = () => {
  const formInputNames = [
    "initialCapital",
    "riskPerBet",
    "betMultiplier",
    "winEveryNbet",
    "numberOfBets"
  ];

  let formInputValues = {};
  formInputNames.forEach(inputName => {
    const value = betFormElem.querySelector(`input[name="${inputName}"]`).value;
    formInputValues[inputName] = value;
  });

  const isRandom = betFormElem.querySelector('input[name="isRandom"]').checked;
  const isTaxed = betFormElem.querySelector('input[name="isTaxed"]').checked;

  let tax = 0;
  if (isTaxed) {
    tax = 0.12;
  }

  const {
    initialCapital,
    riskPerBet,
    betMultiplier,
    winEveryNbet,
    numberOfBets
  } = formInputValues;

  let currentCapital = initialCapital;
  let percentageInvestmentReturn = 0;
  let percentageInvestmentReturnAfterTax = 0;
  let wins = 0;
  let losses = 0;
  let simulation = [];

  for (let i = 1; i <= numberOfBets; i++) {
    let simulationRecord = {};
    simulationRecord["currentCapital"] = parseFloat(currentCapital).toFixed(2);

    let betAmount = parseFloat((currentCapital * riskPerBet) / 100).toFixed(2);
    let betAmountAfterTax = betAmount - betAmount * tax;
    let amountToWin = parseFloat(betAmountAfterTax) * parseFloat(betMultiplier);

    simulationRecord["betAmount"] = parseFloat(betAmount).toFixed(2);
    simulationRecord["betAmountAfterTax"] = parseFloat(
      betAmountAfterTax
    ).toFixed(2);
    simulationRecord["amountToWin"] = parseFloat(amountToWin).toFixed(2);

    if (isIterationWin(i, winEveryNbet, isRandom)) {
      wins++;
      currentCapital = parseFloat(currentCapital) + parseFloat(amountToWin);
      simulationRecord["won"] = true;
    } else {
      losses++;
      currentCapital = parseFloat(currentCapital) - parseFloat(betAmount);
      simulationRecord["won"] = false;
    }

    currentCapital = parseFloat(currentCapital).toFixed(2);
    simulation.push(simulationRecord);
  }

  percentageInvestmentReturn = parseFloat(
    ((currentCapital - initialCapital) / initialCapital) * 100
  ).toFixed(2);

  const result = {
    wins,
    losses,
    percentageInvestmentReturn,
    percentageInvestmentReturnAfterTax,
    simulation
  };

  return result;
};

betFormElem.addEventListener("submit", e => {
  e.preventDefault();
  const resultElem = document.querySelector("#result");
  const simulationElem = document.querySelector("#simulation");

  const {
    wins,
    losses,
    percentageInvestmentReturn,
    simulation
  } = performCounting();

  let resultHTML = "";
  resultHTML += "<h3>Wyniki</h3>";
  resultHTML += `
    <p>
      Wygranych: ${wins}<br>
      Przegranych: ${losses}<br>
      Stopa zwrotu: ${percentageInvestmentReturn}%<br>
    </p>
  `;

  let simulationHTML = "";
  simulationHTML += "<h3>Symulacja</h3>";
  simulationHTML += "<table>";
  simulationHTML += `
    <tr>
      <th>Nr</th>
      <th>Kapitał</th>
      <th>Kwota zakładu</th>
      <th>Po opodatkowaniu</th>
      <th>Do wygrania</th>
      <th>Status</th>
    </tr>
  `;

  simulation.forEach((row, index) => {
    simulationHTML += `
      <tr>
        <td>
          ${index + 1}
        </td>
        <td>
          ${row.currentCapital}
        </td>
        <td>
          ${row.betAmount}
        </td>
        <td>
          ${row.betAmountAfterTax}
        </td>
        <td>
          ${row.amountToWin}
        </td>
        <td>
          ${row.won === true ? "wygrana" : "przegrana"}
        </td>
      </tr>
    `;
  });

  simulationHTML += "</table>";

  resultElem.innerHTML = resultHTML;
  simulationElem.innerHTML = simulationHTML;
});
