import { useState, useEffect, useRef, memo } from 'react';
import JapanMap from '../../assets/japan.svg';
import { ReactSVG } from 'react-svg';
import './styles.css';
// images for pref
import Tokyo from './images/Tokyo.png';

export const Images = {
  Tokyo: Tokyo,
};
// custom label ref for text tooltip
// eslint-disable-next-line react/prop-types, react/display-name
const CustomToolTip = memo(({ pref_label, x_pos, y_pos }) => {
  const tooltipRef = useRef();

  useEffect(() => {
    if (tooltipRef.current) {
      const tooltip = tooltipRef.current;
      tooltip.style.left = `${x_pos + 10}px`;
      tooltip.style.top = `${y_pos + 10}px`;
    }
  }, [x_pos, y_pos]);
  console.log(pref_label);

  return (
    <div
      ref={tooltipRef}
      style={{ color: 'red', fontSize: '30px' }}
      className="tooltip-container"
    >
      <span>{pref_label}</span>
      <img src={Images[pref_label]} height={100} width={300} alt="Pref" />
    </div>
  );
});

// cusom svg approach
const SVGApproach = () => {
  const [map, setMap] = useState(JapanMap);
  const mapRef = useRef();
  // data to update tooltip data
  const [tooltipData, setToolTipData] = useState({
    prefLabel: '',
    x_pos: 0,
    y_pos: 0,
  });

  // setting the svg data to map
  useEffect(() => {
    if (JapanMap) {
      setMap(JapanMap);
    }
  }, []);

  // custom modificatio of svg map
  const getSvgInjectionElements = (svg) => {
    const paths = svg.querySelectorAll('path');
    // extracting the paths and adding colors
    let path_collection = [];
    const path_map = new Map();
    for (let pathIndex = 0; pathIndex < paths.length; pathIndex++) {
      const current_path = paths[pathIndex];
      path_collection.push(current_path);
      const pref_title = current_path.getAttribute('title');
      const pref_id = current_path.id;
      path_map.set(pref_id, pref_title);
    }

    // modifications to prefs
    path_collection.forEach((path) => {
      path.style.cursor = 'pointer';
      // adding on hover
      path.addEventListener('mouseover', (path_event) => {
        const path_x_position = path_event.clientX;
        const path_y_position = path_event.clientY;
        const pref_label = path_map.get(path.id);
        setToolTipData({
          prefLabel: pref_label,
          x_pos: path_x_position,
          y_pos: path_y_position,
        });
      });

      // removing it
      path.addEventListener('mouseout', () => {
        setToolTipData({
          prefLabel: '',
          x_pos: 0,
          y_pos: 0,
        });
      });
    });
  };

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <div
        style={{
          position: 'relative',
          width: '200px',
        }}
      >
        <ReactSVG
          ref={mapRef}
          beforeInjection={(svg) => getSvgInjectionElements(svg)}
          src={map}
          useRequestCache={false}
          fallback={() => <span>Error!</span>}
          style={{ transform: 'scale(1.5)', transformOrigin: 'top left' }}
        />
      </div>

      <div>
        {tooltipData.prefLabel !== '' && (
          <CustomToolTip
            pref_label={tooltipData.prefLabel}
            x_pos={tooltipData.x_pos}
            y_pos={tooltipData.y_pos}
          />
        )}
      </div>
    </div>
  );
};

export default SVGApproach;
