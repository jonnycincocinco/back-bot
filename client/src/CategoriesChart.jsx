import React from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';

function CategoriesChart(props) {
  const { categories } = props;

  const data = [];
  const labels = Object.keys(categories);
  const values = Object.values(categories);

  for (let i = 0; i < labels.length; i++) {
    data.push({ name: labels[i], value: Math.round(values[i]) });
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19D2', '#FF0000'];

  // function findHighestValue(arr) {
  //   const highestValue = Math.max(...arr.map((category) => category.value));
  //   return arr.map((category) => {
  //     let name = category.name;
  //     if (name === 'Food and Drink') {
  //       name = 'Indulgent Foodie';
  //     } else if (name === 'Travel') {
  //       name = 'Adventurous';
  //     } else if (name === 'Recreation') {
  //       name = 'Relaxing';
  //     } else if (name === 'Shops') {
  //       name = 'Shopping';
  //     }
  //     return {
  //       name,
  //       value: category.value,
  //       isHighestValue: category.value === highestValue,
  //     };
  //   });
  // }

  // const highestValues = findHighestValue(data);

  // const categoryImages = highestValues.map((highestValue, index) => {
  //   const { name, isHighestValue } = highestValue;
  //   const imageName = `/${name.toLowerCase().replace(/ /g, '-')}.gif`;
  //   return (
  //     <div key={`category-image-${index}`}>
  //       {isHighestValue && <h3>You are a {name}</h3>}
  //       {isHighestValue && <img src={imageName} alt={name} />}
  //     </div>
  //   );
  // });

  const renderLabel = (value) => {
    return `$${value.value.toLocaleString()}`;
  };

  return (
    <div className="holdingsList">
      {/* <div>{categoryImages}</div> */}

      <h4 className="holdingsHeading">Spending Categories</h4>
      <PieChart width={400} height={400}>
        <Legend />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          isAnimationActive={false}
          paddingAngle={5}
          label={renderLabel}
          innerRadius={70}
          outerRadius={90}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}

export default CategoriesChart;
