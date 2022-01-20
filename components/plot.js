import React from 'react';
import plotly from 'plotly.js/dist/plotly';
import createPlotComponent from 'react-plotly.js/factory';

// const Plot = createPlotComponent(plotly);
const Plot = require('react-plotly.js').default;
export default () => (
  <Plot 
      data={[
          {
              type: 'bar',
              x: ['Taubira', 'Hidalgo', 'Mélenchon'],
              y: [29,150,85]
          }
      ]}
      layout={ { width: 1000, height: 500, title: 'Nombre de voix par candidat' } }
  />
)
