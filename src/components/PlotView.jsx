import React from "react";
import Plot from "react-plotly.js";

export default function PlotView({ data, title = "ARGO Plot" }) {
  return (
    <div className="w-full h-96 rounded-xl shadow-xl border border-[#A6B1E1] p-4 bg-gradient-to-br from-[#424874] to-[#DCD6F7]">
      <Plot
        data={[
          { 
            x: data?.x, 
            y: data?.y, 
            type: "scatter", 
            mode: "lines+markers", 
            marker: { 
              color: "#F4EEFF",
              size: 8,
              line: {
                color: "#424874",
                width: 1
              }
            },
            line: {
              color: "#F4EEFF",
              width: 3,
              shape: 'spline'
            }
          }
        ]}
        layout={{ 
          title: {
            text: title,
            font: {
              color: "#F4EEFF",
              family: "Inter, sans-serif",
              size: 20
            }
          },
          autosize: true,
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(238, 245, 255, 0.1)',
          font: {
            color: "#F4EEFF",
            family: "Inter, sans-serif"
          },
          xaxis: {
            gridcolor: 'rgba(238, 245, 255, 0.1)',
            linecolor: '#A6B1E1',
            zerolinecolor: 'rgba(238, 245, 255, 0.2)'
          },
          yaxis: {
            gridcolor: 'rgba(238, 245, 255, 0.1)',
            linecolor: '#A6B1E1',
            zerolinecolor: 'rgba(238, 245, 255, 0.2)'
          },
          margin: {
            l: 60,
            r: 40,
            b: 60,
            t: 80,
            pad: 10
          }
        }}
        style={{ width: "100%", height: "100%" }}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['lasso2d', 'select2d']
        }}
      />
    </div>
  );
}