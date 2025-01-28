import React, { useState, useEffect } from 'react'
import { Chart as ChartJS, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { GetSoldProducts } from '../../components/services/pointOfSale';
import Title from "../../components/features/Title";

ChartJS.register(
    BarElement,
);

export default function BarChart() {
    const [chart, setChart] = useState([])

    const GetSoldItems = async () => {
        try {
            const response = await GetSoldProducts();
            setChart(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        GetSoldItems();
    }, [])


    var data = {
        labels: chart?.map(x => x.product),
        datasets: [{
            label: 'Sold Products Quantity',
            data: chart?.map(x => x.total_quantity),
            backgroundColor: [
                'rgba(54, 162, 235, 1)',
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1
        }]
    };

    var options = {
        maintainAspectRatio: false,
        scales: {
        },
        legend: {
            labels: {
                fontSize: 25,
            },
        },
    }

    return (
        <div>
            <Title>Sold Items</Title>
            <div class="chart-container" style={{ position: 'relative', height: '40vh' }}>
            <Bar
                data={data}
               // height={400}
                options={options}
            />
            </div>
        </div>
    )

}
