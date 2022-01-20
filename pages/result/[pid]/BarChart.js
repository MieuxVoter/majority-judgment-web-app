import dynamic from 'next/dynamic';
import plotly from 'plotly.js/dist/plotly';
import createPlotComponent from 'react-plotly.js/factory';
import React, { Component } from 'react';
//import Plot from 'react-plotly.js';

class BarChart extends Component {
    render() {
        return (
            <div>
                <Plot 
                    data={[
                        {
                            type: 'bar',
                            x: ['Taubira', 'Hidalgo', 'Mélenchon'],
                            y: [29,150,85]
                        }
                    ]}
                    layout={ { width: 1000, height: 500, title: 'Nombre de voix par candidat' } }
                    config={{
                        displayModeBar: false // this is the line that hides the bar.
                    }}
                />
            </div>
        )
    };
}

export default BarChart;