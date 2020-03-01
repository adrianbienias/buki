const betFormElem = document.querySelector('#betForm');

const randomInt = max => Math.floor(Math.random() * Math.floor(max));

const isIterationWin = (iteration, winAccuracy, numberOfBets, isRandom) => {
  let winAccuracyNumber = Math.round(100 / parseInt(winAccuracy, 10));
  winAccuracy = iteration % winAccuracyNumber;

  // 100 / 100 = 1
  // 100 / 90 = 1,111111111111111 ~ 1
  // 100 / 80 = 1,25 ~ 1
  // 100 / 70 = 1,428571428571429 ~ 1
  // 100 / 67 = 1,492537313432836 ~ 1
  // 100 / 66 = 1,515151515151515 ~ 2
  // 100 / 60 = 1,666666666666667 ~ 2
  // 100 / 50 = 2

  if (isRandom === true) {
    return winAccuracy === randomInt(winAccuracyNumber);
  } else {
    return winAccuracy === 0;
  }
};

const getFormInputValues = () => {
  const formInputNames = [
    'initialCapital',
    'amountPerBet',
    'betMultiplier',
    'winAccuracy',
    'numberOfBets',
  ];

  let formInputValues = {};
  formInputNames.forEach(inputName => {
    const value = betFormElem.querySelector(`input[name="${inputName}"]`).value;
    formInputValues[inputName] = value;
  });

  formInputValues.isRandom = betFormElem.querySelector('input[name="isRandom"]').checked;
  formInputValues.isTaxed = betFormElem.querySelector('input[name="isTaxed"]').checked;

  return formInputValues;
};

const performCounting = () => {
  const {
    initialCapital,
    amountPerBet,
    betMultiplier,
    winAccuracy,
    isRandom,
    numberOfBets,
    isTaxed,
  } = getFormInputValues();

  let currentCapital = initialCapital;
  let tax = isTaxed ? 0.12 : 0;
  let percentageInvestmentReturn = 0;
  let wins = 0;
  let losses = 0;

  let simulation = [];
  for (let i = 1; i <= numberOfBets; i++) {
    let simulationData = {};

    let capitalBeforeBet = parseFloat(currentCapital);
    let betAmount = parseFloat(amountPerBet);
    let betAmountAfterTax = betAmount - betAmount * parseFloat(tax);
    let amountToWin = parseFloat(betAmountAfterTax) * parseFloat(betMultiplier);
    let capitalAfterBet = capitalBeforeBet - betAmount;

    if (isIterationWin(i, winAccuracy, numberOfBets, isRandom)) {
      wins++;
      capitalAfterBet += parseFloat(amountToWin);
      simulationData['won'] = true;
    } else {
      losses++;
      simulationData['won'] = false;
    }

    currentCapital = parseFloat(capitalAfterBet);

    simulationData['capitalBeforeBet'] = parseFloat(capitalBeforeBet).toFixed(2);
    simulationData['betAmount'] = parseFloat(betAmount).toFixed(2);
    simulationData['betAmountAfterTax'] = parseFloat(betAmountAfterTax).toFixed(2);
    simulationData['amountToWin'] = parseFloat(amountToWin).toFixed(2);
    simulationData['capitalAfterBet'] = parseFloat(capitalAfterBet).toFixed(2);

    simulation.push(simulationData);
  }

  percentageInvestmentReturn = parseFloat(
    ((currentCapital - initialCapital) / initialCapital) * 100,
  ).toFixed(2);

  const result = {
    wins,
    losses,
    percentageInvestmentReturn,
    simulation,
  };

  return result;
};

const handleSubmit = e => {
  e.preventDefault();
  const resultElem = document.querySelector('#result');
  const simulationElem = document.querySelector('#simulation');

  const { wins, losses, percentageInvestmentReturn, simulation } = performCounting();

  let resultHTML = '';
  resultHTML += '<h3>Wyniki</h3>';
  resultHTML += `
    <p>
      Wygranych: ${wins}<br>
      Przegranych: ${losses}<br>
      Stopa zwrotu: ${percentageInvestmentReturn}%<br>
    </p>
  `;

  let simulationHTML = '';
  simulationHTML += '<h3>Symulacja</h3>';
  simulationHTML += '<table>';
  simulationHTML += `
    <tr>
      <th>Nr</th>
      <th>Kapitał</th>
      <th>Kwota zakładu</th>
      <th>Po opodatkowaniu</th>
      <th>Do wygrania</th>
      <th>Status</th>
      <th>Kapitał po zakładzie</th>
    </tr>
  `;

  simulation.forEach((row, index) => {
    simulationHTML += `
      <tr>
        <td>
          ${index + 1}
        </td>
        <td>
          ${row.capitalBeforeBet}
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
          ${row.won === true ? '✅' : '❌'}
        </td>
        <td>
          ${row.capitalAfterBet}
        </td>
      </tr>
    `;
  });

  simulationHTML += '</table>';

  resultElem.innerHTML = resultHTML;
  simulationElem.innerHTML = simulationHTML;
};

betFormElem.addEventListener('submit', handleSubmit);
