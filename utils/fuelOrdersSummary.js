const FuelOrder = require("../models/FuelOrder");

//get monthly data
const getOrdersMonthlySummary = async (stationId, month, year) => {
  let fuelOrderData;
  let orderByType = [];

  //filtering order data
  await FuelOrder.aggregate([
    {
      $match: {
        stationId: { $regex: stationId, $options: "i" },
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          month: {
            $month: {
              $dateFromString: { dateString: "$orderDate", format: "%Y-%m-%d" },
            },
          },
          year: {
            $year: {
              $dateFromString: { dateString: "$orderDate", format: "%Y-%m-%d" },
            },
          },
        },
        amount: { $sum: "$amount" },
        payment: { $sum: "$payment" },
      },
    },
    {
      $match: {
        $and: [
          { "_id.month": parseInt(month) },
          { "_id.year": parseInt(year) },
        ],
      },
    },
    {
      $group: {
        _id: "$_id.type",
        amount: { $sum: "$amount" },
        payment: { $sum: "$payment" },
      },
    },
  ]).then((data) => {
    fuelOrderData = data;
  });

  let totalPayment = 0;
  let totalAmount = 0;
  let count = 0;

  //get total amount and payment
  for (let i = 0; i < fuelOrderData.length; i++) {
    totalPayment += fuelOrderData[i].payment;
    totalAmount += fuelOrderData[i].amount;
    count++;
  }

  //get percentage by type
  for (let i = 0; i < fuelOrderData.length; i++) {
    let percentage = Math.round((fuelOrderData[i].amount / totalAmount) * 100);
    orderByType.push({
      type: fuelOrderData[i]._id,
      percentage,
    });
  }

  const summary = {
    stationId,
    totalOrders: count,
    totalAmount,
    totalPayment,
    percentages: orderByType,
  };

  return summary;
};

//get annual data
const getOrdersAnnualSummary = async (stationId, year) => {
  let fuelOrderData;
  let orderByType = [];

  //filtering order data
  await FuelOrder.aggregate([
    {
      $match: {
        stationId: { $regex: stationId, $options: "i" },
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          year: {
            $year: {
              $dateFromString: { dateString: "$orderDate", format: "%Y-%m-%d" },
            },
          },
        },
        amount: { $sum: "$amount" },
        payment: { $sum: "$payment" },
      },
    },
    {
      $match: {
        $and: [{ "_id.year": parseInt(year) }],
      },
    },
    {
      $group: {
        _id: "$_id.type",
        amount: { $sum: "$amount" },
        payment: { $sum: "$payment" },
      },
    },
  ]).then((data) => {
    fuelOrderData = data;
  });

  let totalPayment = 0;
  let totalAmount = 0;
  let count = 0;

  //get total amount and payment
  for (let i = 0; i < fuelOrderData.length; i++) {
    totalPayment += fuelOrderData[i].payment;
    totalAmount += fuelOrderData[i].amount;
    count++;
  }

  //get percentage by type
  for (let i = 0; i < fuelOrderData.length; i++) {
    let percentage = Math.round((fuelOrderData[i].amount / totalAmount) * 100);
    orderByType.push({
      type: fuelOrderData[i]._id,
      percentage,
    });
  }

  const summary = {
    stationId,
    totalOrders: count,
    totalAmount,
    totalPayment,
    percentages: orderByType,
  };

  return summary;
};

module.exports = { getOrdersMonthlySummary, getOrdersAnnualSummary };
