const FuelUsage = require("../models/FuelUsage");
const FuelOrder = require("../models/FuelOrder");

//get monthly data
const getMonthlyFuelConsumption = async (
  stationId,
  month,
  year,
  orderSummary
) => {
  let fuelTypes = [];
  let customerData;

  //filtering allocation data
  await FuelUsage.aggregate([
    {
      $match: {
        stationId: { $regex: stationId, $options: "i" },
      },
    },
    {
      $group: {
        _id: {
          month: {
            $month: {
              $dateFromString: { dateString: "$date", format: "%Y-%m-%d" },
            },
          },
          year: {
            $year: {
              $dateFromString: { dateString: "$date", format: "%Y-%m-%d" },
            },
          },
        },
        totalAmount: { $sum: "$pumpedAmount" },
        totalCustomers: { $count: {} },
      },
    },
    {
      $match: {
        _id: { month: parseInt(month), year: parseInt(year) },
      },
    },
  ]).then((data) => {
    customerData = data;
  });

  orderSummary.percentages.map((data) => {
    fuelTypes.push(data.type);
  });

  let remainingFuelAmount =
    orderSummary.totalAmount -
    (customerData.length > 0 ? customerData[0].totalAmount : 0);

  const consumeSummary = {
    types: fuelTypes,
    totalPumpedAmount:
      customerData.length > 0 ? customerData[0].totalAmount : 0,
    remainingFuelAmount,
    totalCustomers:
      customerData.length > 0 ? customerData[0].totalCustomers : 0,
  };

  return consumeSummary;
};

//get annual data
const getAnnualFuelConsumption = async (stationId, year, orderSummary) => {
  let fuelTypes = [];
  let customerData;

  //filtering allocation data
  await FuelUsage.aggregate([
    {
      $match: {
        stationId: { $regex: stationId, $options: "i" },
      },
    },
    {
      $group: {
        _id: {
          year: {
            $year: {
              $dateFromString: { dateString: "$date", format: "%Y-%m-%d" },
            },
          },
        },
        totalAmount: { $sum: "$pumpedAmount" },
        totalCustomers: { $count: {} },
      },
    },
    {
      $match: {
        _id: { year: parseInt(year) },
      },
    },
  ]).then((data) => {
    customerData = data;
  });

  orderSummary.percentages.map((data) => {
    fuelTypes.push(data.type);
  });

  let remainingFuelAmount =
    orderSummary.totalAmount - customerData.length > 0
      ? customerData[0].totalAmount
      : 0;

  const consumeSummary = {
    types: fuelTypes,
    totalPumpedAmount:
      customerData.length > 0 ? customerData[0].totalAmount : 0,
    remainingFuelAmount,
    totalCustomers:
      customerData.length > 0 ? customerData[0].totalCustomers : 0,
  };

  return consumeSummary;
};

module.exports = { getMonthlyFuelConsumption, getAnnualFuelConsumption };
