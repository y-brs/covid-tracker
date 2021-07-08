import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import dateFormat from "dateformat";
import { casesTypeColors } from "../Utils"

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem, data) {
            return numeral(tooltipItem.parsed.y).format("+0,0");
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'nearest',
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      y: {
        grid: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          }
        }
      }
    }
  };

const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;

  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: dateFormat(date, "d mmm"),
        y: data[casesType][date] - lastDataPoint,
      };

      chartData.push(newDataPoint);
    }

    lastDataPoint = data[casesType][date];
  }

  return chartData;
};

function LineGraph({ casesType, countryCode, ...props }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/historical/all?lastdays=120"
        : `https://disease.sh/v3/covid-19/historical/${countryCode}/?lastdays=120`;


    const fetchData = async () => {
      await fetch(url, {mode: "cors"})
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (countryCode === "worldwide") {
            let chartData = buildChartData(data, casesType);
            setData(chartData);
          } else {
            let chartData = buildChartData(data.timeline, casesType);
            setData(chartData);
          };
        });
    };

    fetchData();
  }, [casesType, countryCode]);

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [{
                fill: true,
                backgroundColor: casesTypeColors[casesType].bgFill,
                borderColor: casesTypeColors[casesType].hex,
                data: data
              }]
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;