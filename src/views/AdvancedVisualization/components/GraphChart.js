import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState, useRef } from 'react';
import { fetchData } from '../../Instance/data';
import { useGraphData } from './useGraphData';

const GraphChart = () => {
  const { instanceViewConfig, organizationId, workspaceId, scenario, datasets } = useGraphData();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [isExploring, setIsExploring] = useState(false);
  const chartRef = useRef(null);
  const animationTimeoutRef = useRef(null);

  useEffect(() => {
    const loadGraphData = async () => {
      try {
        const result = await fetchData(instanceViewConfig, organizationId, workspaceId, scenario, datasets);
        if (result?.data?.Customer && result?.data?.arc_Satisfaction) {
          // First, count links for each node
          const linkCounts = {};
          result.data.arc_Satisfaction.forEach((arc) => {
            linkCounts[arc.source] = (linkCounts[arc.source] || 0) + 1;
            linkCounts[arc.target] = (linkCounts[arc.target] || 0) + 1;
          });

          // Find max links to normalize colors
          const maxLinks = Math.max(...Object.values(linkCounts));

          // Process nodes (Customers)
          const nodes = result.data.Customer.map((customer) => {
            const linkCount = linkCounts[customer.id] || 0;
            const colorScale = linkCount / maxLinks;
            const color = colorScale < 0.3 ? '#5470c6' : colorScale < 0.6 ? '#91cc75' : '#ee6666';

            return {
              id: customer.id,
              name: customer.id,
              symbol:
                'path://M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 ' +
                '820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm5.6-532.7c53.4' +
                ' 0 96.7 43.3 96.7 96.7 0 53.4-43.3 96.7-96.7 96.7-53.4 0-96.7-43.3-96.7-96.7 0-53.4 43.3-96.7 ' +
                '96.7-96.7zm0 430.7c-159.4 0-288.8-129.4-288.8-288.8 0-159.4 129.4-288.8 288.8-288.8 159.4 0 288.8 ' +
                '129.4 288.8 288.8 0 159.4-129.4 288.8-288.8 288.8z',
              symbolSize: 50,
              value: customer.name || customer.id,
              itemStyle: {
                color,
                borderColor: '#3ba272',
                borderWidth: 2,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 10,
              },
            };
          });

          // Process links (arc_Satisfaction)
          const links = result.data.arc_Satisfaction.map((arc, index) => {
            const satisfaction = arc.satisfaction || 1;
            const color = satisfaction < 0.5 ? '#ee6666' : satisfaction < 0.8 ? '#fac858' : '#91cc75';
            return {
              id: `link${index}`,
              source: arc.source,
              target: arc.target,
              value: satisfaction,
              lineStyle: {
                color,
                width: Math.max(1, satisfaction * 5),
                opacity: 0.05,
                curveness: 0.3,
              },
            };
          });

          setGraphData({ nodes, links });
        }
      } catch (error) {
        console.error('Error fetching graph data:', error);
      }
    };
    loadGraphData();

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [instanceViewConfig, organizationId, workspaceId, scenario, datasets]);

  const handleNodeDoubleClick = (params) => {
    if (params.dataType === 'node' && chartRef.current) {
      // Clear any existing animation
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      setIsExploring(true);

      const nodeLinks = graphData.links.filter(
        (link) => link.source === params.data.id || link.target === params.data.id
      );

      // Reset all links to dim state
      const chart = chartRef.current.getEchartsInstance();
      chart.setOption(
        {
          series: [
            {
              id: 'graph',
              links: graphData.links.map((link) => ({
                ...link,
                lineStyle: {
                  ...link.lineStyle,
                  opacity: 0.05,
                },
              })),
            },
          ],
        },
        { replaceMerge: ['series'] }
      );

      // Sequentially highlight links with smoother timing
      const animateLinks = (index) => {
        if (index < nodeLinks.length) {
          const updatedLinks = graphData.links.map((link) => {
            if (link.id === nodeLinks[index].id) {
              return {
                ...link,
                lineStyle: {
                  ...link.lineStyle,
                  opacity: 1,
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              };
            }
            return link;
          });

          chart.setOption(
            {
              series: [
                {
                  id: 'graph',
                  links: updatedLinks,
                },
              ],
            },
            { replaceMerge: ['series'] }
          );

          animationTimeoutRef.current = setTimeout(() => animateLinks(index + 1), 400);
        } else {
          // Reset after all links are shown
          animationTimeoutRef.current = setTimeout(() => {
            chart.setOption(
              {
                series: [
                  {
                    id: 'graph',
                    links: graphData.links,
                  },
                ],
              },
              { replaceMerge: ['series'] }
            );
            setIsExploring(false);
          }, 1500);
        }
      };

      animateLinks(0);
    }
  };

  const option = {
    title: {
      text: 'Customer Satisfaction Network',
    },
    tooltip: {
      show: true,
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: function (params) {
        if (params.dataType === 'node') {
          const linkCount = params.data.id
            ? graphData.links.filter((link) => link.source === params.data.id || link.target === params.data.id).length
            : 0;
          return `Customer: ${params.name}<br/>Connections: ${linkCount}`;
        }
        return '';
      },
      position: 'top',
    },
    series: [
      {
        id: 'graph',
        type: 'graph',
        layout: 'circular',
        circular: {
          rotateLabel: true,
        },
        data: graphData.nodes,
        links: graphData.links,
        roam: !isExploring,
        draggable: false,
        label: {
          show: false,
        },
        emphasis: {
          focus: 'adjacency',
          blurScope: 'global',
          scale: true,
          itemStyle: {
            borderWidth: 2,
            borderColor: '#3ba272',
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        animation: true,
        animationDuration: 300,
        animationEasingUpdate: 'quadraticInOut',
      },
    ],
  };

  // const handleSearch = useCallback(
  //   (value) => {
  //     setSearchTerm(value);
  //     if (!chartRef.current) return;
  //
  //     const chart = chartRef.current.getEchartsInstance();
  //     const nodes = graphData.nodes;
  //
  //     // Reset all nodes to default state
  //     nodes.forEach((node) => {
  //       chart.dispatchAction({
  //         type: 'downplay',
  //         seriesIndex: 0,
  //         dataIndex: nodes.indexOf(node),
  //       });
  //     });
  //
  //     if (value) {
  //       // Find nodes that match the search term
  //       const matchingNodes = nodes.filter(
  //         (node) =>
  //           node.name.toLowerCase().includes(value.toLowerCase()) ||
  //           (node.value && node.value.toLowerCase().includes(value.toLowerCase()))
  //       );
  //
  //       // Highlight matching nodes
  //       matchingNodes.forEach((node) => {
  //         const nodeIndex = nodes.indexOf(node);
  //
  //         // Highlight node and its connections
  //         chart.dispatchAction({
  //           type: 'showTip',
  //           seriesIndex: 0,
  //           dataIndex: nodeIndex,
  //         });
  //
  //         // Focus view on the first matching node
  //         if (node === matchingNodes[0]) {
  //           chart.dispatchAction({
  //             type: 'dataZoom',
  //             seriesIndex: 0,
  //             dataIndex: nodeIndex,
  //           });
  //
  //           // Center and zoom to the first matching node
  //           chart.dispatchAction({
  //             type: 'showTip',
  //             seriesIndex: 0,
  //             zoom: 2,
  //             dataIndex: nodeIndex,
  //           });
  //         }
  //       });
  //     }
  //   },
  //   [graphData.nodes]
  // );

  return (
    <div style={{ width: '100%', height: '800px' }}>
      {/* <Box sx={{ mb: 2, width: '100%' }}> */}
      {/*  <TextField */}
      {/*    fullWidth */}
      {/*    variant="outlined" */}
      {/*    size="small" */}
      {/*    placeholder="Search nodes..." */}
      {/*    value={searchTerm} */}
      {/*    onChange={(e) => handleSearch(e.target.value)} */}
      {/*    sx={{ */}
      {/*      backgroundColor: 'white', */}
      {/*      '& .MuiOutlinedInput-root': { */}
      {/*        '& fieldset': { */}
      {/*          borderColor: '#3ba272', */}
      {/*        }, */}
      {/*        '&:hover fieldset': { */}
      {/*          borderColor: '#3ba272', */}
      {/*        }, */}
      {/*        '&.Mui-focused fieldset': { */}
      {/*          borderColor: '#3ba272', */}
      {/*        }, */}
      {/*      }, */}
      {/*    }} */}
      {/*  /> */}
      {/* </Box> */}
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: '100%' }}
        opts={{ renderer: 'canvas' }}
        onEvents={{
          click: (params) => {
            if (params.dataType === 'node') {
              // Force show tooltip at click position
              const chart = chartRef.current.getEchartsInstance();
              chart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: params.dataIndex,
                position: [params.event.offsetX, params.event.offsetY],
              });
            }
          },
          dblclick: handleNodeDoubleClick,
        }}
      />
    </div>
  );
};

export default GraphChart;
