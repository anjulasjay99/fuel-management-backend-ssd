const router = require("express").Router();
const {
  getOrdersMonthlySummary,
  getOrdersAnnualSummary,
} = require("../utils/fuelOrdersSummary");
const {
  getMonthlyFuelConsumption,
  getAnnualFuelConsumption,
} = require("../utils/fuelConsumptionSummary");

router.route("/monthly/generate").get(async (req, res) => {
  const month = req.query.month;
  const year = req.query.year;
  const stationId = req.query.id;

  if (month && year && stationId) {
    try {
      const orderSum = await getOrdersMonthlySummary(stationId, month, year);
      const consumeSum = await getMonthlyFuelConsumption(
        stationId,
        month,
        year,
        orderSum
      );
      res.status(200).json({
        stationId,
        month,
        year,
        orderSum,
        consumeSum,
        dateGenerated: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.log(error);
      res.status(400).json("No data available");
    }
  } else {
    res.status(400).json("Some parameters are missing");
  }
});

router.route("/annual/generate").get(async (req, res) => {
  const year = req.query.year;
  const stationId = req.query.id;

  if (year && stationId) {
    try {
      const orderSum = await getOrdersAnnualSummary(stationId, year);
      const consumeSum = await getAnnualFuelConsumption(
        stationId,
        year,
        orderSum
      );
      res.status(200).json({
        stationId,
        year,
        orderSum,
        consumeSum,
        dateGenerated: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.log(error);
      res.status(400).json("No data available");
    }
  } else {
    res.status(400).json("Some parameters are missing");
  }
});

module.exports = router;
