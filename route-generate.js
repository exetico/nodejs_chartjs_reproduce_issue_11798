// External dependencies
import { registerFont } from 'canvas';


// Chart.js specific
import { Chart } from 'chart.js/auto';
import { createCanvas } from 'canvas';
import chartjsPluginAnnotation from 'chartjs-plugin-annotation';

// Configure Chart.js
Chart.register(
	chartjsPluginAnnotation,
	{
	  id: "BackgroundColor",
	  beforeDraw: (chart) => {
		const { ctx } = chart;
		ctx.save();
		ctx.fillStyle = 'white'; // Set background color
		ctx.fillRect(0, 0, chart.canvas.width, chart.canvas.height);
		ctx.restore();
	  }
	}
);

registerFont('assets/BebasNeue Bold.otf', { family: 'Bebas Neue' });

export const generateDataByTypeForChartJS = (type) => {
    if(type === "ok"){
        // Sample data
        const labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const data = {
        labels: labels,
        datasets: [{
            label: "Cool dataset",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: Array.from({ length: labels.length }, () => Math.floor(Math.random() * 50)),
        }]
        };

        return { data };
    }

    else if(type === "invalid"){
        // Generate data for a full year
        const labels = [];
        const dataset = [];

        for (let i = 0; i < 12; i++) {
            const month = i + 1;
            for (let j = 1; j <= 31; j++) {
                const day = j < 10 ? `0${j}` : j;
                labels.push(`${month}/${day}`);
                for (let k = 0; k < 10; k++) {
                    dataset.push(Math.floor(Math.random() * 50));
                }
            }
        }

        const data = {
            labels: labels,
            datasets: [{
                label: "Cool dataset",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: dataset,
            }]
        };

        return { data };
    }else {
        throw new Error('Invalid type. Supported: ok, invalid<br>Go to <a href="/">home</a>');
    }
}

export const generateRoute = (req, res) => {
    const canvas = createCanvas(510, 310);
    const ctx = canvas.getContext("2d");

    // Get type from query string
    const urlParams = new URLSearchParams(req.url.split("?")[1]);
    const type = urlParams.get("type");
    // Get modifiers
    const opts = urlParams.get("opts");

    const no_annotations = opts && opts.includes("no-annotations");
    const no_defaults = opts && opts.includes("no-defaults");

    if(!no_defaults){
        Chart.defaults.font.family = 'Bebas Neue';
        Chart.defaults.font.size = 12;
        Chart.defaults.font.weight = 700;
        Chart.defaults.responsive = false;
        Chart.defaults.maintainAspectRatio = false;
        Chart.defaults.animation = false;
    }

    // Generate data
    const { data } = generateDataByTypeForChartJS(type);

    // Annotations
    const minIndex = data.datasets[0].data.indexOf(Math.min(...data.datasets[0].data));
    const maxIndex = data.datasets[0].data.indexOf(Math.max(...data.datasets[0].data));
    const average = data.datasets[0].data.reduce((a, b) => a + b, 0) / data.datasets[0].data.length;

    const annotations = !no_annotations && {
        annotations: {
            line1: {
                type: "line",
                yMin: average,
                yMax: average,
                borderColor: "rgb(255, 99, 132)",
                borderWidth: 2,
                borderDash: [5, 5], // Set border dash for dotted line
            },
            averageAnnotation: {
                type: "label",
                backgroundColor: "rgba(0,235,0,0.8)",
                content: "Average",
                padding: 2,
                font: {
                    size: 11,
                },
                position: "center",
                xAdjust: 0,
                yAdjust: -20,
                yValue: average,
                labelOffset: {
                    y: -10,
                },
                xValue: minIndex,
            },
            minAnnotation: {
                type: "label",
                backgroundColor: "rgba(0,235,0,0.8)",
                content: "Min",
                padding: 2,
                font: {
                    size: 11,
                },
                position: "center",
                xAdjust: 0,
                yAdjust: -20,
                yValue: Math.min(...data.datasets[0].data),
                labelOffset: {
                    y: -10,
                },
                xValue: minIndex,
            },
            maxAnnotation: {
                type: "label",
                backgroundColor: "rgba(0,235,0,0.8)",
                content: "Max",
                padding: 2,
                font: {
                    size: 11,
                },
                position: "center",
                xAdjust: 0,
                yAdjust: 10,
                yValue: Math.max(...data.datasets[0].data),
                labelOffset: {
                    y: 10,
                },
                xValue: maxIndex,
            },
        },
    };


    // Generate the chart
    new Chart(ctx, {
      type: "line",
      data: data,
      options: {
        plugins: {
          annotation: !no_annotations && annotations,
        },
      },
    });

    // Respond with the chart as a PNG image
    res.writeHead(200, { "Content-Type": "image/png" });
    canvas.createPNGStream().pipe(res);
};