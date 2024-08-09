// import React, { useEffect, useRef, useState } from 'react';
// import * as d3 from 'd3';
// import Hls from 'hls.js';

// import Timeline from "./timeline"

// const Timeline = () => {
//   const svgRef = useRef();
//   const videoRef = useRef(null);
//   const [currentTime, setCurrentTime] = useState(12); // Example initial time in hours (12:00)
//   const [xScale, setXScale] = useState(() => d3.scaleLinear().domain([0, 24]).range([0, 1000]));

//   useEffect(() => {
//     const handleUserInteraction = () => {
//       if (Hls.isSupported()) {
//         const hls = new Hls();
//         hls.loadSource('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
//         hls.attachMedia(videoRef.current);
//         hls.on(Hls.Events.MANIFEST_PARSED, () => {
//           videoRef.current.play().catch(error => {
//             console.error('Error attempting to play video:', error);
//           });
//         });

//         return () => {
//           hls.destroy();
//         };
//       } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
//         videoRef.current.src = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
//         videoRef.current.addEventListener('loadedmetadata', () => {
//           videoRef.current.play().catch(error => {
//             console.error('Error attempting to play video:', error);
//           });
//         });
//       }
//     };

//     document.addEventListener('click', handleUserInteraction, { once: true });

//     return () => {
//       document.removeEventListener('click', handleUserInteraction);
//     };
//   }, []);

//   useEffect(() => {
//     const width = 1000;
//     const height = 100;

//     const svg = d3.select(svgRef.current)
//       .attr('width', width)
//       .attr('height', height);

//     const initialXScale = d3.scaleLinear()
//       .domain([0, 24]) // hours from 0 to 24
//       .range([0, width]);

//     setXScale(initialXScale);

//     const xAxis = d3.axisBottom(initialXScale)
//       .tickValues(d3.range(0, 25)) // Include 24 for the last tick
//       .tickFormat(d => `${d}:00`);

//     const zoom = d3.zoom()
//       .scaleExtent([1, 24]) // Limit zoom from 1x to 24x
//       .extent([[0, 0], [width, height]])
//       .translateExtent([[0, 0], [width, height]])
//       .on('zoom', zoomed);

//     svg.append('rect')
//       .attr('width', width)
//       .attr('height', height)
//       .style('fill', 'none')
//       .style('pointer-events', 'all')
//       .call(zoom);

//     const xAxisGroup = svg.append('g')
//       .attr('transform', `translate(0, ${height - 20})`)
//       .call(xAxis);

//     const redLine = svg.append('line')
//       .attr('x1', initialXScale(currentTime))
//       .attr('y1', 0)
//       .attr('x2', initialXScale(currentTime))
//       .attr('y2', height - 20)
//       .attr('stroke', 'red')
//       .attr('stroke-width', 2)
//       .style('cursor', 'pointer');

//     function handleTimelineClick(event) {
//       const [clickX] = d3.pointer(event);
//       const clickedTime = initialXScale.invert(clickX);
//       const preciseTime = clickedTime.toFixed(2); // Or use Math.round(clickedTime) for nearest hour
//       setCurrentTime(preciseTime);
//       redLine
//         .attr('x1', initialXScale(preciseTime))
//         .attr('x2', initialXScale(preciseTime));
//       const video = videoRef.current;
//       if (video) {
//         video.currentTime = preciseTime * 60 * 60; // Convert hours to seconds
//         if (video.paused) {
//           video.play().catch(error => {
//             console.error('Error attempting to play video:', error);
//           });
//         }
//       }
//       console.log(`Timeline clicked at time: ${preciseTime}`);
//     }

//     svg.on('click', handleTimelineClick);

//     function zoomed(event) {
//       const newXScale = event.transform.rescaleX(initialXScale);
//       xAxisGroup.call(xAxis.scale(newXScale));
//       const zoomLevel = event.transform.k;
//       if (zoomLevel >= 1) {
//         if (zoomLevel >= 8) {
//           xAxis.tickValues(d3.range(0, 24, 0.1));
//           xAxis.tickFormat(d => {
//             const hour = Math.floor(d);
//             const minutes = (d - hour) * 60;
//             return `${hour}:${minutes < 10 ? '0' : ''}${Math.floor(minutes)}`;
//           });
//         } else {
//           xAxis.tickValues(d3.range(0, 24));
//           xAxis.tickFormat(d => `${d}:00`);
//         }
//       }
//       xAxisGroup.call(xAxis);
//       redLine
//         .attr('x1', newXScale(currentTime))
//         .attr('x2', newXScale(currentTime));
//       setXScale(newXScale); // Update xScale state to keep it in sync
//     }

//     const updateRedLine = () => {
//       const video = videoRef.current;
//       if (video) {
//         const videoCurrentTimeInHours = video.currentTime / 3600; // Convert seconds to hours
//         setCurrentTime(videoCurrentTimeInHours);
//         redLine
//           .attr('x1', xScale(videoCurrentTimeInHours))
//           .attr('x2', xScale(videoCurrentTimeInHours));
//       }
//     };

//     const video = videoRef.current;
//     if (video) {
//       video.addEventListener('timeupdate', updateRedLine);
//     }

//     return () => {
//       svg.on('click', null);
//       svg.selectAll("*").remove();
//       if (video) {
//         video.removeEventListener('timeupdate', updateRedLine);
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <svg ref={svgRef}></svg>
//       <video
//         width="640"
//         height="360"
//         ref={videoRef}
//         controls
//         muted
//       ></video>
//     </div>
//   );
// };

// export default Timeline;

// # timeline which is zoom while play video and red light is moving . 

// import React, { useEffect, useRef, useState } from 'react';
// import * as d3 from 'd3';
// import Hls from 'hls.js';

// const Timeline = () => {
//   const svgRef = useRef();
//   const videoRef = useRef(null);
//   const [currentTime, setCurrentTime] = useState(12); // Example initial time in hours (12:00)
//   const [xScale, setXScale] = useState(() => d3.scaleLinear().domain([0, 24]).range([0, 1000]));
//   const xScaleRef = useRef(xScale); // Reference for xScale to be used in event listeners

//   useEffect(() => {
//     const handleUserInteraction = () => {
//       if (Hls.isSupported()) {
//         const hls = new Hls();
//         hls.loadSource('https://media1.ambicam.com:443/dvr30/6eb06634-127d-445e-8178-8d3c1489892c/22_07_24/6eb06634-127d-445e-8178-8d3c1489892c.m3u8');
//         hls.attachMedia(videoRef.current);
//         hls.on(Hls.Events.MANIFEST_PARSED, () => {
//           videoRef.current.play().catch(error => {
//             console.error('Error attempting to play video:', error);
//           });
//         });

//         return () => {
//           hls.destroy();
//         };
//       } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
//         videoRef.current.src = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
//         videoRef.current.addEventListener('loadedmetadata', () => {
//           videoRef.current.play().catch(error => {
//             console.error('Error attempting to play video:', error);
//           });
//         });
//       }
//     };

//     document.addEventListener('click', handleUserInteraction, { once: true });

//     return () => {
//       document.removeEventListener('click', handleUserInteraction);
//     };
//   }, []);

//   useEffect(() => {
//     const width = 1000;
//     const height = 100;

//     const svg = d3.select(svgRef.current)
//       .attr('width', width)
//       .attr('height', height);

//     const initialXScale = d3.scaleLinear()
//       .domain([0, 24]) // hours from 0 to 24
//       .range([0, width]);

//     setXScale(initialXScale);
//     xScaleRef.current = initialXScale;

//     const xAxis = d3.axisBottom(initialXScale)
//       .tickValues(d3.range(0, 25)) // Include 24 for the last tick
//       .tickFormat(d => `${d}:00`);

//     const zoom = d3.zoom()
//       .scaleExtent([1, 24]) // Limit zoom from 1x to 24x
//       .extent([[0, 0], [width, height]])
//       .translateExtent([[0, 0], [width, height]])
//       .on('zoom', zoomed);

//     svg.append('rect')
//       .attr('width', width)
//       .attr('height', height)
//       .style('fill', 'none')
//       .style('pointer-events', 'all')
//       .call(zoom);

//     const xAxisGroup = svg.append('g')
//       .attr('transform', `translate(0, ${height - 20})`)
//       .call(xAxis);

//     const redLine = svg.append('line')
//       .attr('x1', initialXScale(currentTime))
//       .attr('y1', 0)
//       .attr('x2', initialXScale(currentTime))
//       .attr('y2', height - 20)
//       .attr('stroke', 'red')
//       .attr('stroke-width', 2)
//       .style('cursor', 'pointer');

//     function handleTimelineClick(event) {
//       const [clickX] = d3.pointer(event);
//       const clickedTime = initialXScale.invert(clickX);
//       const preciseTime = clickedTime.toFixed(2); // Or use Math.round(clickedTime) for nearest hour
//       setCurrentTime(preciseTime);
//       redLine
//         .attr('x1', initialXScale(preciseTime))
//         .attr('x2', initialXScale(preciseTime));
//       const video = videoRef.current;
//       if (video) {
//         video.currentTime = preciseTime * 60 * 60; // Convert hours to seconds
//         if (video.paused) {
//           video.play().catch(error => {
//             console.error('Error attempting to play video:', error);
//           });
//         }
//       }
//       console.log(`Timeline clicked at time: ${preciseTime}`);
//     }

//     svg.on('click', handleTimelineClick);

//     function zoomed(event) {
//       const newXScale = event.transform.rescaleX(initialXScale);
//       xAxisGroup.call(xAxis.scale(newXScale));
//       const zoomLevel = event.transform.k;
//       if (zoomLevel >= 1) {
//         if (zoomLevel >= 8) {
//           xAxis.tickValues(d3.range(0, 24, 0.1));
//           xAxis.tickFormat(d => {
//             const hour = Math.floor(d);
//             const minutes = (d - hour) * 60;
//             return `${hour}:${minutes < 10 ? '0' : ''}${Math.floor(minutes)}`;
//           });
//         } else {
//           xAxis.tickValues(d3.range(0, 24));
//           xAxis.tickFormat(d => `${d}:00`);
//         }
//       }
//       xAxisGroup.call(xAxis);
//       redLine
//         .attr('x1', newXScale(currentTime))
//         .attr('x2', newXScale(currentTime));
//       xScaleRef.current = newXScale;
//     }

//     const updateRedLine = () => {
//       const video = videoRef.current;
//       if (video) {
//         const videoCurrentTimeInHours = video.currentTime / 3600; // Convert seconds to hours
//         setCurrentTime(videoCurrentTimeInHours);
//         redLine
//           .attr('x1', xScaleRef.current(videoCurrentTimeInHours))
//           .attr('x2', xScaleRef.current(videoCurrentTimeInHours));
//       }
//     };

//     const video = videoRef.current;
//     if (video) {
//       video.addEventListener('timeupdate', updateRedLine);
//     }

//     return () => {
//       svg.on('click', null);
//       svg.selectAll("*").remove();
//       if (video) {
//         video.removeEventListener('timeupdate', updateRedLine);
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <svg ref={svgRef}></svg>
//       <video
//         width="640"
//         height="360"
//         ref={videoRef}
//         controls
//         muted
//       ></video>
//     </div>
//   );
// };

// export default Timeline;

// # complete Timeline

// import React, { useEffect, useRef, useState } from 'react';
// import * as d3 from 'd3';
// import Hls from 'hls.js';

// const Timeline = () => {
//   const svgRef = useRef();
//   const videoRef = useRef(null);
//   const [currentTime, setCurrentTime] = useState(12); // Example initial time in hours (12:00)
//   const [xScale, setXScale] = useState(() => d3.scaleLinear().domain([0, 24]).range([0, 1000]));
//   const xScaleRef = useRef(xScale); // Reference for xScale to be used in event listeners

//   useEffect(() => {
//     const handleUserInteraction = () => {
//       if (Hls.isSupported()) {
//         const hls = new Hls();
//         hls.loadSource('https://media1.ambicam.com:443/dvr30/6eb06634-127d-445e-8178-8d3c1489892c/22_07_24/6eb06634-127d-445e-8178-8d3c1489892c.m3u8');
//         hls.attachMedia(videoRef.current);
//         hls.on(Hls.Events.MANIFEST_PARSED, () => {
//           videoRef.current.play().catch(error => {
//             console.error('Error attempting to play video:', error);
//           });
//         });

//         return () => {
//           hls.destroy();
//         };
//       } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
//         videoRef.current.src = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
//         videoRef.current.addEventListener('loadedmetadata', () => {
//           videoRef.current.play().catch(error => {
//             console.error('Error attempting to play video:', error);
//           });
//         });
//       }
//     };

//     document.addEventListener('click', handleUserInteraction, { once: true });

//     return () => {
//       document.removeEventListener('click', handleUserInteraction);
//     };
//   }, []);

//   useEffect(() => {
//     const width = 1000;
//     const height = 100;

//     const svg = d3.select(svgRef.current)
//       .attr('width', width)
//       .attr('height', height);

//     const initialXScale = d3.scaleLinear()
//       .domain([0, 24]) // hours from 0 to 24
//       .range([0, width]);

//     setXScale(initialXScale);
//     xScaleRef.current = initialXScale;

//     const xAxis = d3.axisBottom(initialXScale)
//       .tickValues(d3.range(0, 25)) // Include 24 for the last tick
//       .tickFormat(d => `${d}:00`);

//     const zoom = d3.zoom()
//       .scaleExtent([1, 24]) // Limit zoom from 1x to 24x
//       .extent([[0, 0], [width, height]])
//       .translateExtent([[0, 0], [width, height]])
//       .on('zoom', zoomed);

//     svg.append('rect')
//       .attr('width', width)
//       .attr('height', height)
//       .style('fill', 'none')
//       .style('pointer-events', 'all')
//       .call(zoom);

//     const xAxisGroup = svg.append('g')
//       .attr('transform', `translate(0, ${height - 20})`)
//       .call(xAxis);

//     const redLine = svg.append('line')
//       .attr('x1', initialXScale(currentTime))
//       .attr('y1', 0)
//       .attr('x2', initialXScale(currentTime))
//       .attr('y2', height - 20)
//       .attr('stroke', 'red')
//       .attr('stroke-width', 2)
//       .style('cursor', 'pointer');

//     function handleTimelineClick(event) {
//       const [clickX] = d3.pointer(event);
//       const clickedTime = xScaleRef.current.invert(clickX);
//       const preciseTime = clickedTime.toFixed(2); // Or use Math.round(clickedTime) for nearest hour
//       setCurrentTime(preciseTime);
//       redLine
//         .attr('x1', xScaleRef.current(preciseTime))
//         .attr('x2', xScaleRef.current(preciseTime));
//       const video = videoRef.current;
//       if (video) {
//         video.currentTime = preciseTime * 60 * 60; // Convert hours to seconds
//         if (video.paused) {
//           video.play().catch(error => {
//             console.error('Error attempting to play video:', error);
//           });
//         }
//       }
//       console.log(`Timeline clicked at time: ${preciseTime}`);
//     }

//     svg.on('click', handleTimelineClick);

//     function zoomed(event) {
//       const newXScale = event.transform.rescaleX(initialXScale);
//       xAxisGroup.call(xAxis.scale(newXScale));
//       const zoomLevel = event.transform.k;
//       if (zoomLevel >= 1) {
//         if (zoomLevel >= 8) {
//           xAxis.tickValues(d3.range(0, 24, 0.1));
//           xAxis.tickFormat(d => {
//             const hour = Math.floor(d);
//             const minutes = (d - hour) * 60;
//             return `${hour}:${minutes < 10 ? '0' : ''}${Math.floor(minutes)}`;
//           });
//         } else {
//           xAxis.tickValues(d3.range(0, 24));
//           xAxis.tickFormat(d => `${d}:00`);
//         }
//       }
//       xAxisGroup.call(xAxis);
//       xScaleRef.current = newXScale;

//       // Update the red line's position immediately
//       const videoCurrentTimeInHours = videoRef.current ? videoRef.current.currentTime / 3600 : currentTime; // Convert seconds to hours
//       redLine
//         .attr('x1', newXScale(videoCurrentTimeInHours))
//         .attr('x2', newXScale(videoCurrentTimeInHours));
//     }

//     const updateRedLine = () => {
//       const video = videoRef.current;
//       if (video) {
//         const videoCurrentTimeInHours = video.currentTime / 3600; // Convert seconds to hours
//         setCurrentTime(videoCurrentTimeInHours);
//         redLine
//           .attr('x1', xScaleRef.current(videoCurrentTimeInHours))
//           .attr('x2', xScaleRef.current(videoCurrentTimeInHours));
//       }
//     };

//     const video = videoRef.current;
//     if (video) {
//       video.addEventListener('timeupdate', updateRedLine);
//     }

//     return () => {
//       svg.on('click', null);
//       svg.selectAll("*").remove();
//       if (video) {
//         video.removeEventListener('timeupdate', updateRedLine);
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <svg ref={svgRef}></svg>
//       <video
//         width="640"
//         height="360"
//         ref={videoRef}
//         controls
//         muted
//       ></video>
//     </div>
//   );
// };

// export default Timeline;
