import React, { useMemo } from 'react';

import { currencyFilter, pluralize } from './Util';
import CategoriesChart from './CategoriesChart';
import { TransactionType } from './types';

export default function SpendingInsights(props) {
  const transactions = props.transactions;
  const monthlyTransactions = useMemo(() => {
    const today = new Date();
    const oneMonthAgo = new Date(new Date().setDate(today.getDate() - 30));
    return transactions.filter(tx => {
      const date = new Date(tx.date);
      return (
        date > oneMonthAgo &&
        tx.category !== 'Payment' &&
        tx.category !== 'Transfer' &&
        tx.category !== 'Interest'
      );
    });
  }, [transactions]);

  const categoriesObject = useMemo(() => {
    return monthlyTransactions.reduce((obj, tx) => {
      if (obj.hasOwnProperty(tx.category)) {
        obj[tx.category] = tx.amount + obj[tx.category];
      } else {
        obj[tx.category] = tx.amount;
      }
      return obj;
    }, {});
  }, [monthlyTransactions]);

  const namesObject = useMemo(() => {
    return monthlyTransactions.reduce((obj, tx) => {
      if (obj.hasOwnProperty(tx.name)) {
        obj[tx.name] = tx.amount + obj[tx.name];
      } else {
        obj[tx.name] = tx.amount;
      }
      return obj;
    }, {});
  }, [monthlyTransactions]);

  const sortedNames = useMemo(() => {
    const namesArray = [];
    for (const name in namesObject) {
      if (namesObject.hasOwnProperty(name)) {
        namesArray.push([name, namesObject[name]]);
      }
    }
    namesArray.sort((a, b) => b[1] - a[1]);
    namesArray.splice(5);
    return namesArray;
  }, [namesObject]);

  return (
    <div>
      <h2 className="monthlySpendingHeading">Monthly Spending</h2>
      <h4 className="tableSubHeading">A breakdown of your monthly swimming</h4>
      <div className="monthlySpendingText">{`Monthly breakdown across ${
        props.numOfItems
      } bank ${pluralize('account', props.numOfItems)}`}</div>
      <div className="monthlySpendingContainer">
        <div className="userDataBox">
          <CategoriesChart categories={categoriesObject} />
        </div>
        <div className="userDataBox">
          <div className="holdingsList">
            <h4 className="holdingsHeading">Top 5 Transactions</h4>
            <div className="spendingInsightData">
              <p className="title">Transactions</p>
              <p className="title">Amount</p>
              {sortedNames.map(vendor => (
                <React.Fragment key={vendor[0]}>
                  <p>{vendor[0]}</p>
                  <p>{currencyFilter(vendor[1])}</p>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
