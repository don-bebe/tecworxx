import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CountIndividualWork } from '../../components/services/workSlice';
import Title from "../../components/features/Title";

import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart() {
    const [chart, setChart] = useState([]);

    useEffect(() => {
        CountWork();
    }, []);

    const CountWork = async () => {
        try {
            const response = await CountIndividualWork();
            setChart(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const data = {
        labels: chart?.map(x=>x.lastName),
        datasets: [{
            label: 'Total Job cards',
            data: chart?.map(x => x.total),
            backgroundColor: [
                'rgb(0, 255, 255)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgb(0, 150, 255)',
                'rgb(20, 52, 164)',
                'rgb(31, 81, 255)',
                'rgb(65, 105, 225)',
                'rgb(8, 24, 168)',
                'rgb(64, 224, 208)',
                'rgb(135, 206, 235)',
                'rgb(204, 204, 255)',
                'rgb(0, 0, 128)',
                'rgb(63, 0, 255)',
                'rgb(240, 255, 255)'
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
                fontSize: 10,
            },
        },
    };

    return (
        <>
            <Title>Technician work progress</Title>
            <div class="chart-container" style = {{position: 'relative', height:'40vh'}}>
            <Pie
                data={data}
                //height={250}
                options={options}
            />
            </div>
        </>
    )
}
