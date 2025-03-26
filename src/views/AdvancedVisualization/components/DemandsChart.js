import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as echarts from 'echarts';
import demandsData from '../data/demands.json';

const DemandsChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimestep, setCurrentTimestep] = useState(1);
  const animationRef = useRef(null);
  const [error, setError] = useState(null);

  // Define colors for the bars
  const normalColor = '#5470c6'; // Neutral blue color
  const highlightColor = '#ff5500'; // Bright orange for high values
  const highlightThreshold = 245;

  useEffect(() => {
    console.log('Initial data:', demandsData);
    if (!Array.isArray(demandsData)) {
      setError('Invalid data format');
      return;
    }
    if (demandsData.length === 0) {
      setError('No data available');
    }
  }, []);

  // Get min and max timesteps
  const timestepRange = useMemo(() => {
    if (!demandsData.length) return { min: 1, max: 1 };
    return demandsData.reduce(
      (acc, item) => ({
        min: Math.min(acc.min, item.Timestep),
        max: Math.max(acc.max, item.Timestep),
      }),
      { min: Infinity, max: -Infinity }
    );
  }, []);

  // Extract unique product types from IDs
  const productTypes = useMemo(() => {
    return Array.from(
      new Set(
        demandsData.map((item) => {
          const match = item.id.match(/FinalProduct_([A-Z])_/);
          return match ? match[1] : null;
        })
      )
    )
      .filter(Boolean)
      .sort();
  }, []);

  // Initialize chart when the component mounts
  useEffect(() => {
    if (!chartRef.current) return;

    // If chart already exists, dispose it to prevent duplicates
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    // Create chart instance
    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;

    // Initial empty chart
    const option = {
      title: {
        text: 'Demands by ID',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: function (params) {
          const data = params[0];
          return `${data.name}<br/>Demand: ${data.value}${data.value >= highlightThreshold ? ' (High Demand)' : ''}`;
        },
      },
      grid: {
        top: 80,
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
          interval: 0,
          rotate: 45,
          textStyle: {
            fontSize: 10,
          },
        },
        animationDuration: 300,
        animationDurationUpdate: 300,
      },
      yAxis: {
        type: 'value',
        name: 'Demand',
        min: 150,
        max: 260,
        interval: 10,
      },
      series: [
        {
          type: 'bar',
          data: [],
          barWidth: '60%',
          label: {
            show: true,
            position: 'top',
            valueAnimation: true,
            formatter: function (params) {
              return params.value;
            },
          },
          animationDuration: 1000,
          animationDurationUpdate: 1000,
          animationEasing: 'cubicInOut',
          animationEasingUpdate: 'cubicInOut',
        },
      ],
      animationDuration: 1000,
      animationDurationUpdate: 1000,
      animationEasing: 'cubicInOut',
      animationEasingUpdate: 'cubicInOut',
    };

    chart.setOption(option);

    // Handle resize
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [highlightThreshold]);

  // Update chart when timestep, product selection, or product count changes
  useEffect(() => {
    if (!chartInstance.current || !demandsData.length) return;

    console.log('Updating chart with product filter:', selectedProduct);
    console.log('Current timestep:', currentTimestep);

    // Filter and sort data for current timestep
    const currentData = demandsData.filter(
      (item) =>
        item.Timestep === currentTimestep &&
        (selectedProduct === 'all' || item.id.includes(`FinalProduct_${selectedProduct}_`))
    );

    console.log('Filtered data count:', currentData.length);

    // Prepare data for chart with two colors based on threshold
    const formattedData = currentData.map((d) => ({
      name: d.id,
      value: d.Demands,
      itemStyle: {
        // Use highlight color for high values, otherwise use normal color
        color: d.Demands >= highlightThreshold ? highlightColor : normalColor,
      },
      // Add emphasis effect for highlighted bars
      emphasis: {
        itemStyle: {
          shadowBlur: d.Demands >= highlightThreshold ? 10 : 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    }));

    // Update chart
    const option = {
      title: {
        text: `Demands by ID (Timestep ${currentTimestep})`,
      },
      xAxis: {
        data: currentData.map((d) => d.id),
      },
      series: [
        {
          data: formattedData,
        },
      ],
    };

    // Use setOption with specific parameters for smooth transitions
    chartInstance.current.setOption(option, {
      notMerge: false,
      lazyUpdate: false,
    });
  }, [currentTimestep, selectedProduct, normalColor, highlightColor, highlightThreshold]);

  // Animation control
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = setInterval(() => {
        setCurrentTimestep((prev) => {
          const next = prev + 1;
          if (next > timestepRange.max) {
            setIsPlaying(false);
            return timestepRange.min;
          }
          return next;
        });
      }, 1000);

      return () => {
        if (animationRef.current) {
          clearInterval(animationRef.current);
        }
      };
    }
  }, [isPlaying, timestepRange.max, timestepRange.min]);

  const handlePlayPause = () => {
    if (!isPlaying && currentTimestep === timestepRange.max) {
      setCurrentTimestep(timestepRange.min);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTimestep(timestepRange.min);
  };

  const handleTimelineChange = (event) => {
    const newTimestep = parseInt(event.target.value, 10);
    setIsPlaying(false);
    setCurrentTimestep(newTimestep);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <label htmlFor="productFilter" style={{ marginRight: '10px' }}>
            Filter by Product Type:
          </label>
          <select
            id="productFilter"
            value={selectedProduct}
            onChange={(e) => {
              console.log('Product filter changed to:', e.target.value);
              setIsPlaying(false);
              setCurrentTimestep(timestepRange.min);
              setSelectedProduct(e.target.value);
            }}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          >
            <option value="all">All Products</option>
            {productTypes.map((type) => (
              <option key={type} value={type}>
                Product {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            onClick={handlePlayPause}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: '#3182bd',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Timeline slider */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>Timeline:</span>
          <span>Timestep: {currentTimestep}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>{timestepRange.min}</span>
          <input
            type="range"
            min={timestepRange.min}
            max={timestepRange.max}
            value={currentTimestep}
            onChange={handleTimelineChange}
            style={{ flex: 1 }}
          />
          <span>{timestepRange.max}</span>
        </div>
      </div>

      {/* Legend for color coding */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: normalColor, borderRadius: '3px' }}></div>
          <span>Normal Demand</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: highlightColor, borderRadius: '3px' }}></div>
          <span>High Demand (≥ {highlightThreshold})</span>
        </div>
      </div>

      <div
        ref={chartRef}
        style={{
          width: '100%',
          height: '600px',
        }}
      />
    </>
  );
};

export default DemandsChart;
