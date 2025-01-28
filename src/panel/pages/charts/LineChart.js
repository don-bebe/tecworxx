import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { GetTotal } from '../../components/services/pointOfSale';
import Title from '../../components/features/Title';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, annotationPlugin);

export default function LineChart() {
    const [chart, setChart] = useState([]);

    useEffect(() => {
        GetTotalSales();
    }, [])

    const GetTotalSales = async () => {
        try {
            const response = await GetTotal();
            setChart(response.data);
        } catch (error) {
            console.log(error)
        }
    }

    const data = {
        labels: chart?.map(x => x.day),
        datasets: [{
            label: 'Total',
            data: chart?.map(x => x.total),
            fill: false,
            borderColor: 'rgba(54, 162, 235, 1)',
            tension: 0.1
        }]
    }

    var options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
        },
        legend: {
            labels: {
                fontSize: 15,
            },
        },
        plugins: {
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: 20000,
                        yMax: 20000,
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 2,
                    }
                }
            }
        }
    }


    return (
        <>
            <Title>Monthly Total Sales</Title>
            <div class="chart-container" style={{ position: 'relative', height: '40vh' }}>
                <Line
                    data={data}
                    //height={250}
                    options={options}
                />
            </div>
        </>
    )
}
