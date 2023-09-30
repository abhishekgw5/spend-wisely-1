import React from "react";
import { Progress } from "antd";
import "../styles/analyticsStyles.css";
import moment from "moment";

const Analytics = ({ allTransaction }) => {
  const categories = [
    "salary",
    "stipend",
    "entertainment",
    "shopping",
    "food",
    "travel",
    "bills",
    "tax",
  ];

  //total transactions
  const totalTransaction = allTransaction.length;
  const totalIncomeTransactions = allTransaction.filter(
    (transaction) => transaction.type === "income"
  );
  const totalExpenseTransactions = allTransaction.filter(
    (transaction) => transaction.type === "expense"
  );
  const totalIncomePercent =
    (totalIncomeTransactions.length / totalTransaction) * 100;
  const totalExpensePercent =
    (totalExpenseTransactions.length / totalTransaction) * 100;

  //total turnover
  const totalTurnOver = allTransaction.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalIncomeTurnOver = allTransaction
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalExpenseTurnOver = allTransaction
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalIncomeTurnOverPercent =
    (totalIncomeTurnOver / totalTurnOver) * 100;
  const totalExpenseTurnOverPercent =
    (totalExpenseTurnOver / totalTurnOver) * 100;

  // Function to calculate income by month
  const calculateIncomeByMonth = (transactions) => {
    const incomeByMonth = {};
    transactions.forEach((transaction) => {
      const date = moment(transaction.date);
      const monthYear = date.format("MMM YYYY");
      if (transaction.type === "income") {
        if (!incomeByMonth[monthYear]) {
          incomeByMonth[monthYear] = 0;
        }
        incomeByMonth[monthYear] += transaction.amount;
      }
    });
    return incomeByMonth;
  };

  // Function to calculate expense by month
  const calculateExpenseByMonth = (transactions) => {
    const expenseByMonth = {};
    transactions.forEach((transaction) => {
      const date = moment(transaction.date);
      const monthYear = date.format("MMM YYYY");
      if (transaction.type === "expense") {
        if (!expenseByMonth[monthYear]) {
          expenseByMonth[monthYear] = 0;
        }
        expenseByMonth[monthYear] += transaction.amount;
      }
    });
    return expenseByMonth;
  };

  // Function to calculate income by year
  const calculateIncomeByYear = (transactions) => {
    const incomeByYear = {};
    transactions.forEach((transaction) => {
      const date = moment(transaction.date);
      const year = date.format("YYYY");
      if (transaction.type === "income") {
        if (!incomeByYear[year]) {
          incomeByYear[year] = 0;
        }
        incomeByYear[year] += transaction.amount;
      }
    });
    return incomeByYear;
  };

  // Function to calculate expense by year
  const calculateExpenseByYear = (transactions) => {
    const expenseByYear = {};
    transactions.forEach((transaction) => {
      const date = moment(transaction.date);
      const year = date.format("YYYY");
      if (transaction.type === "expense") {
        if (!expenseByYear[year]) {
          expenseByYear[year] = 0;
        }
        expenseByYear[year] += transaction.amount;
      }
    });
    return expenseByYear;
  };

  const incomeByMonth = calculateIncomeByMonth(allTransaction);
  const expenseByMonth = calculateExpenseByMonth(allTransaction);
  
  const incomeByYear = calculateIncomeByYear(allTransaction);
  const expenseByYear = calculateExpenseByYear(allTransaction);

  return (
    <>
      <div className="row m-3 analytics-row">
        <div className="col-md-5">
          <div className="card">
            <div className="card-header">
              Total Transactions : {totalTransaction}
            </div>
            <div className="card-body">
              <h5 className="text-success">
                Income : {totalIncomeTransactions.length}
              </h5>
              <h5 className="text-danger">
                Expense : {totalExpenseTransactions.length}
              </h5>
              <div className="progress-circle">
                <Progress
                  type="circle"
                  strokeColor={"green"}
                  className="mx-2 circle"
                  percent={totalIncomePercent.toFixed(0)}
                />
                <Progress
                  type="circle"
                  strokeColor={"red"}
                  className="mx-2 circle"
                  percent={totalExpensePercent.toFixed(0)}
                />
              </div>
            </div>
          </div>
        </div>

        

        <div className="col-md-5">
          <div className="card">
            <div className="card-header">Total TurnOver : {totalTurnOver}</div>
            <div className="card-body">
              <h5 className="text-success">Income : {totalIncomeTurnOver}</h5>
              <h5 className="text-danger">Expense : {totalExpenseTurnOver}</h5>
              <div className="progress-circle">
                <Progress
                  type="circle"
                  strokeColor={"green"}
                  className="mx-2 circle"
                  percent={totalIncomeTurnOverPercent.toFixed(0)}
                />
                <Progress
                  type="circle"
                  strokeColor={"red"}
                  className="mx-2 circle"
                  percent={totalExpenseTurnOverPercent.toFixed(0)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-3 analytics-row">
        <div className="col-md-5">
          <h4 className="analytics-heading">Categories Income</h4>
          {categories.map((category) => {
            const amount = allTransaction
              .filter(
                (transaction) =>
                  transaction.type === "income" &&
                  transaction.category === category
              )
              .reduce((acc, transaction) => acc + transaction.amount, 0);
            return (
              amount > 0 && (
                <div className="card">
                  <div className="card-body">
                    <h5>{category}</h5>
                    <Progress
                      percent={((amount / totalIncomeTurnOver) * 100).toFixed(
                        0
                      )}
                    />
                  </div>
                </div>
              )
            );
          })}
        </div>
        <div className="col-md-5">
          <h4 className="analytics-heading">Categories Expense</h4>
          {categories.map((category) => {
            const amount = allTransaction
              .filter(
                (transaction) =>
                  transaction.type === "expense" &&
                  transaction.category === category
              )
              .reduce((acc, transaction) => acc + transaction.amount, 0);
            return (
              amount > 0 && (
                <div className="card">
                  <div className="card-body">
                    <h5>{category}</h5>
                    <Progress
                      percent={((amount / totalExpenseTurnOver) * 100).toFixed(
                        0
                      )}
                    />
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
     
      <div className="row mt-3 analytics-row">
        <div className="col-md-5">
          <h4 className="analytics-heading">Income by Month</h4>
          {Object.keys(incomeByMonth).map((month) => (
            <div className="card" key={month}>
              <div className="card-body">
                <h5>{month}</h5>
                <Progress
                  percent={(
                    (incomeByMonth[month] / totalIncomeTurnOver) *
                    100
                  ).toFixed(0)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-5">
          <h4 className="analytics-heading">Expense by Month</h4>
          {Object.keys(expenseByMonth).map((month) => (
            <div className="card" key={month}>
              <div className="card-body">
                <h5>{month}</h5>
                <Progress
                  percent={(
                    (expenseByMonth[month] / totalExpenseTurnOver) *
                    100
                  ).toFixed(0)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="row mt-3 analytics-row">
        <div className="col-md-5">
          <h4 className="analytics-heading">Income by Year</h4>
          {Object.keys(incomeByYear).map((year) => (
            <div className="card" key={year}>
              <div className="card-body">
                <h5>{year}</h5>
                <Progress
                  percent={(
                    (incomeByYear[year] / totalIncomeTurnOver) *
                    100
                  ).toFixed(0)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-5">
          <h4 className="analytics-heading">Expense by Year</h4>
          {Object.keys(expenseByYear).map((year) => (
            <div className="card" key={year}>
              <div className="card-body">
                <h5>{year}</h5>
                <Progress
                  percent={(
                    (expenseByYear[year] / totalExpenseTurnOver) *
                    100
                  ).toFixed(0)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </>
  );
};

export default Analytics;
