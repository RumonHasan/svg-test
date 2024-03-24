import { useState, useEffect, useRef, memo } from 'react';
import jpSvg from '../../assets/jp_2.svg';

import { ReactSVG } from 'react-svg';
import './styles.css';
// images for pref
import Tokyo from './images/Tokyo.png';

export const Images = {
  Tokyo: Tokyo,
};

// original color fills
export const original_fills = {
  Hokkaido: 'rgb(100%,52.156863%,52.156863%)',
  Tohoku: 'rgb(100%,98.431373%,56.862745%)',
  Kanto: 'rgb(47.45098%,100%,46.27451%)',
  Chubu: 'rgb(54.509804%,100%,90.980392%)',
  Shikoku: 'rgb(44.705882%,44.705882%,100%)',
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
  const [map, setMap] = useState(jpSvg);
  const mapRef = useRef();
  // data to update tooltip data
  const [tooltipData, setToolTipData] = useState({
    prefLabel: '',
    x_pos: 0,
    y_pos: 0,
  });

  // custom modificatio of svg map
  const getSvgInjectionElements = (svg) => {
    const paths = svg.querySelectorAll('path');
    // extracting the paths and adding colors
    let path_collection = [];
    const path_map = new Map();
    for (let pathIndex = 0; pathIndex < paths.length; pathIndex++) {
      const current_path = paths[pathIndex];
      const pref_title = current_path.getAttribute('title');
      if (pref_title !== '') {
        path_map.set(pref_title, pref_title);
        path_collection.push(current_path);
      }
    }
    path_collection.forEach((path) => {
      // variables
      const pref_title = path.getAttribute('title');
      // general designs
      path.style.cursor = 'pointer';
      path.style.transition = 'fill 0.3s';
      // adding the hover effects
      path.addEventListener('mouseover', () => {
        path.style.fill = 'red';
      });
      // resetting to original colors
      path.addEventListener('mouseout', () => {
        //fetches back the original colors from the original color array
        const original_path_color = original_fills[path_map.get(pref_title)];
        path.style.fill = `${original_path_color}`;
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
          // style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }}
        />
      </div>

      <div>
        {/* {tooltipData.prefLabel !== '' && (
          <CustomToolTip
            pref_label={tooltipData.prefLabel}
            x_pos={tooltipData.x_pos}
            y_pos={tooltipData.y_pos}
          />
        )} */}
      </div>
    </div>
  );
};

export default SVGApproach;
