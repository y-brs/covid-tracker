import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import dateFormat from "dateformat";

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

function LineGraph({ casesType, ...props }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };

    fetchData();
  }, [casesType]);

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [{
                fill: true,
                backgroundColor: "rgba(204, 16, 52, .5)",
                borderColor: "#CC1034",
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