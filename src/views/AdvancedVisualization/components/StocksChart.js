import ReactEcharts from 'echarts-for-react';
import React, { useCallback, useState } from 'react';
import * as echarts from 'echarts';
import stocksData from '../data/stocks.json';
import transportData from '../data/transports.json';
import worldMapData from '../data/worldMap.geo.json';

const StocksChart = () => {
  const [currentState, setCurrentState] = useState('map');
  // Process the stocks data to get city names and cumulated stocks
  const processStocksData = () => {
    const cityStocks = {};

    // Group stocks by city
    stocksData.forEach((item) => {
      // Extract city name from id (assuming format like "S_Assembled_Battery_Birmingham")
      const cityName = item.id.split('_').pop();

      if (!cityStocks[cityName]) {
        cityStocks[cityName] = {
          name: cityName,
          value: 0,
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
        };
      }

      // Cumulate initial stock
      cityStocks[cityName].value += parseInt(item.initialStock, 10);
    });

    // Convert to array for ECharts
    return Object.values(cityStocks);
  };

  const processedData = processStocksData();

  // Process transportation data to create links between cities
  const processTransportData = () => {
    // Create a map of city names to coordinates for quick lookup
    const cityCoordinates = {};
    processedData.forEach((city) => {
      cityCoordinates[city.name] = [city.longitude, city.latitude];
    });

    // Process transport data to create links
    const links = [];

    transportData.forEach((transport) => {
      // Extract city names from source and target
      const sourceCity = transport.source.split('_').pop();
      const targetCity = transport.target.split('_').pop();

      // Check if we have coordinates for both cities
      if (cityCoordinates[sourceCity] && cityCoordinates[targetCity]) {
        links.push({
          coords: [cityCoordinates[sourceCity], cityCoordinates[targetCity]],
          name: `${sourceCity} to ${targetCity}`,
          mode: transport.mode,
        });
      }
    });

    return links;
  };

  const transportLinks = processTransportData();

  // Get the chart options with both map and bar series for morphing animation
  const getChartOption = useCallback(() => {
    // Sort data by value for better visualization in bar chart
    const sortedData = [...processedData].sort((a, b) => b.value - a.value);

    // Log the processed data to verify coordinates
    console.log('Processed data for chart:', processedData);
    console.log('Transport links:', transportLinks);

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          if (params.seriesType === 'effectScatter') {
            return `${params.name}: ${params.value[2]}`;
          } else if (params.seriesType === 'lines') {
            return `${params.name}<br/>Mode: ${params.value}`;
          } else if (params.seriesType === 'bar') {
            return `${params.name}: ${params.value}`;
          }
          return `${params.name}: ${params.value}`;
        },
      },
      // Add geo component - always included but visibility controlled
      geo: {
        map: 'world',
        roam: true,
        zoom: 1.2, // Slightly zoomed in for better visibility
        center: [0, 20], // Center the map slightly north for better view
        emphasis: {
          itemStyle: {
            areaColor: '#eee',
          },
        },
        silent: currentState !== 'map',
        show: currentState === 'map',
        scaleLimit: {
          min: 1,
          max: 5,
        },
      },
      // Grid, axes, and geo are conditionally included
      ...(currentState === 'bar'
        ? {
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true,
            },
            xAxis: {
              type: 'value',
            },
            yAxis: {
              type: 'category',
              data: sortedData.map((item) => item.name),
            },
          }
        : {
            geo: {
              map: 'world',
              roam: true,
              zoom: 1.2,
              center: [0, 20],
              emphasis: {
                itemStyle: {
                  areaColor: '#eee',
                },
              },
              scaleLimit: {
                min: 1,
                max: 5,
              },
            },
          }),
      // Enable universal transition for morphing animation
      animationDuration: 1000,
      animationEasing: 'cubicInOut',
      universalTransition: {
        enabled: true,
        seriesKey: ['stockPoints', 'stockBars'],
        divideShape: 'split',
      },
      series:
        currentState === 'map'
          ? [
              // Map scatter points series
              {
                id: 'stockPoints',
                name: 'City Stocks',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                animation: true,
                animationDurationUpdate: 1000,
                universalTransition: true,
                animationEasingUpdate: 'cubicInOut',
                data: processedData.map((item) => ({
                  name: item.name,
                  value: [item.longitude, item.latitude, item.value],
                  symbolSize: Math.max(Math.sqrt(item.value) / 2, 8),
                  itemStyle: {
                    color: '#3182bd',
                  },
                })),
                showEffectOn: 'render',
                rippleEffect: {
                  brushType: 'stroke',
                },
                hoverAnimation: true,
                label: {
                  formatter: '{b}',
                  position: 'right',
                  show: true,
                },
                emphasis: {
                  label: {
                    show: true,
                  },
                },
                zlevel: 1,
              },
              // Transportation routes series
              {
                name: 'Transportation Routes',
                type: 'lines',
                coordinateSystem: 'geo',
                zlevel: 2,
                effect: {
                  show: true,
                  period: 6,
                  trailLength: 0.7,
                  color: '#fff',
                  symbolSize: 3,
                },
                lineStyle: {
                  width: 1,
                  opacity: 0.6,
                  curveness: 0.2,
                  color: (params) => {
                    const mode = params.data.value;
                    switch (mode) {
                      case 'Air':
                        return '#ff4500';
                      case 'Sea':
                        return '#1e90ff';
                      case 'Road':
                        return '#32cd32';
                      case 'Rail':
                        return '#9932cc';
                      default:
                        return '#ffa022';
                    }
                  },
                },
                data: transportLinks.map((link) => ({
                  coords: link.coords,
                  name: link.name,
                  value: link.mode,
                })),
              },
            ]
          : [
              // Bar chart series
              {
                id: 'stockBars',
                name: 'Stock Amount',
                type: 'bar',
                animation: true,
                animationDurationUpdate: 1000,
                universalTransition: true,
                animationEasingUpdate: 'cubicInOut',
                itemStyle: {
                  color: '#3182bd',
                },
                data: sortedData.map((item) => ({
                  name: item.name,
                  value: item.value,
                })),
              },
            ],
    };
  }, [currentState, processedData, transportLinks]);

  // Register the world map with ECharts
  echarts.registerMap('world', worldMapData);

  // Toggle between map and bar chart
  const toggleChartType = () => {
    setCurrentState(currentState === 'map' ? 'bar' : 'map');
  };

  return (
    <div style={{ display: 'flex', height: '900px' }}>
      {/* Map/Chart container - taking most of the space */}
      <ReactEcharts
        option={getChartOption()}
        style={{
          flex: '1 1 80%',
          height: '100%',
        }}
        opts={{ renderer: 'canvas' }}
        notMerge={true}
        lazyUpdate={false}
      />

      {/* Controls container - on the right side */}
      <div
        style={{
          flex: '0 0 20%',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: '20px',
        }}
      >
        <h2 style={{ margin: '0 0 10px 0', fontSize: '18px', textAlign: 'center' }}>
          {currentState === 'map' ? 'Global Stock Distribution' : 'City Stock Comparison'}
        </h2>

        <button
          onClick={toggleChartType}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3182bd',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '20px',
          }}
        >
          Switch to {currentState === 'map' ? 'Bar Chart' : 'Map View'}
        </button>

        {/* Description of the visualization */}
        <div>
          <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
            {currentState === 'map'
              ? 'This map shows the global distribution of stocks across different cities. Blue markers indicate ' +
                'stock locations, with size proportional to stock quantity. Transportation routes are color-coded ' +
                'by mode: red-orange (Air), blue (Sea), green (Road), and purple (Rail). Watch the smooth animated ' +
                'transition when switching views!'
              : 'This bar chart compares stock levels across cities, sorted by quantity from highest to lowest. ' +
                'Watch the smooth animated transition when switching views!'}
          </p>
        </div>

        {/* Instructions */}
        <div style={{ marginTop: 'auto' }}>
          <p style={{ fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
            {currentState === 'map'
              ? 'Tip: You can zoom and pan the map. Hover over blue markers to see city names and stock values. ' +
                'Hover over colored lines to see transportation routes and modes (red-orange for Air, blue for ' +
                'Sea, green for Road, purple for Rail).'
              : 'Tip: Hover over bars to see exact stock values.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StocksChart;
