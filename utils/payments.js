const calculatePayment = (type, amount) => {
  let payment = 0;
  switch (type) {
    case "Petrol (92 Octane)":
      payment = 1000 * amount;
      break;
    case "Petrol (95 Octane)":
      payment = 1500 * amount;
      break;
    case "Diesel (Auto Diesel)":
      payment = 2000 * amount;
      break;
    case "Diesel (Lanka Super Diesel)":
      payment = 2500 * amount;
      break;
    default:
      payment = -1;
  }
  return payment;
};

module.exports = { calculatePayment };
