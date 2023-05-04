import React, { useState } from 'react';
import InstanceCytoViz from './instanceCytoViz';
import InstanceG6 from './instanceG6';

const Instance = () => {
  const [G6Viz, setG6Viz] = useState(false);

  return G6Viz ? <InstanceG6 setG6Viz={setG6Viz} /> : <InstanceCytoViz setG6Viz={setG6Viz} />;
};

export default Instance;
