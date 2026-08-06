const fs = require('fs');

console.log("Generating historical waste dataset...");
const num_records = 5000;
let csvContent = "day_of_week,population_density,event_day,current_fill_level,hours_until_full\n";

for (let i = 0; i < num_records; i++) {
  const day = Math.floor(Math.random() * 7);
  const density = Math.floor(Math.random() * 10) + 1;
  const event = Math.random() < 0.1 ? 1 : 0;
  const fill = Math.floor(Math.random() * 80);
  
  let hours_left = 48.0 - (fill * 0.4) - (density * 1.5) - ((day === 5 || day === 6) ? 5 : 0) - (event * 10);
  
  // Add some noise
  hours_left += (Math.random() * 4 - 2); 
  
  if (hours_left < 0.5) hours_left = 0.5;
  
  csvContent += `${day},${density},${event},${fill},${hours_left.toFixed(2)}\n`;
}

fs.writeFileSync('historical_waste_data.csv', csvContent);
console.log("Dataset saved to historical_waste_data.csv with 5000 records.");
