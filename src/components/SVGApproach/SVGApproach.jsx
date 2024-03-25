import { ReactSVG } from 'react-svg';
import './styles.css';
import { useRef, useCallback, useEffect } from 'react';
// main svg import
import jpSvg from '../../assets/jp_2.svg';
// images of regions
import Chubu from './images/Chubu.jpeg';
import Chugoku from './images/Chugoku.jpeg';
import Hokkaido from './images/Hokkaido.jpeg';
import Kansai from './images/Kansai.jpeg';
import Kanto from './images/Kanto.jpeg';
import Kyushu from './images/Kyushu.jpeg';
import Shikoku from './images/Shikoku.jpeg';
import Tohoku from './images/Tohoku.jpeg';

export const Images = {
  Chubu: Chubu,
  Chugoku: Chugoku,
  Hokkaido: Hokkaido,
  Kansai: Kansai,
  Kanto: Kanto,
  Kyushu: Kyushu,
  Shikoku: Shikoku,
  Tohoku: Tohoku,
};

// original color fills
export const original_fills = {
  Hokkaido: 'rgb(100%,52.156863%,52.156863%)',
  Tohoku: 'rgb(100%,98.431373%,56.862745%)',
  Kanto: 'rgb(47.45098%,100%,46.27451%)',
  Chubu: 'rgb(54.509804%,100%,90.980392%)',
  Chugoku: 'rgb(100%,56.862745%,28.235294%)',
  Kansai: 'rgb(44.705882%,44.705882%,100%)',
  Shikoku: 'rgb(81.960784%,43.137255%,100%)',
  Kyushu: 'rgb(77.254902%,77.254902%,77.254902%)',
  Okinawa: 'rgb(7.254902%,77.254902%,77.254902%)',
};

// make rgb lighter
const darken_rgb_vals = (rgbColor, darkeningFactor) => {
  const [r, g, b] = rgbColor
    .replace(/[^\d.,]/g, '')
    .split(',')
    .map(Number);

  const newG = Math.max(g - darkeningFactor * 100, 0);
  const newB = Math.max(b - darkeningFactor * 100, 0);

  return `rgb(${r}%, ${newG}%, ${newB}%)`;
};

// cusom svg approach
const SVGApproach = () => {
  const mapRef = useRef();
  // data to update tooltip data
  const tooltipRef = useRef('Kanto');

  // jumps to the desired page
  const jump_to_page = (region) => {};

  // custom modificatio of svg map
  const getSvgInjectionElements = useCallback((svg) => {
    const paths = svg.querySelectorAll('path');
    let current_selected_path = null;
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
    // filtered paths
    path_collection.forEach((path) => {
      // variables
      const pref_title = path.getAttribute('title');
      const original_path_color = original_fills[path_map.get(pref_title)];
      const original_path_color_darkened = darken_rgb_vals(
        original_path_color,
        0.5
      );
      // general designs
      path.style.cursor = 'pointer';
      path.style.transition = 'fill 0.3s, stroke 0.3s';
      // adding the hover effects
      path.addEventListener('mouseover', () => {
        // remains the same selected color unless hovered over another region
        if (current_selected_path) {
          const current_path_title =
            current_selected_path.getAttribute('title');
          current_selected_path.style.fill = `${
            original_fills[path_map.get(current_path_title)]
          }`;
          current_selected_path.style.stroke = 'none';
        }
        current_selected_path = path;
        path.style.fill = `${original_path_color_darkened}`;
        path.style.stroke = 'black'; // Add a black border
        path.style.strokeWidth = '2px';
        // updating the tooltip ref directly to prevent rerender
        tooltipRef.current.textContent = pref_title;
        // adding an img
        const tooltip_img = document.createElement('img');
        tooltip_img.src = Images[pref_title];
        tooltip_img.alt = pref_title;
        tooltip_img.style.height = '95%';
        tooltip_img.style.width = '100%';
        tooltip_img.style.borderBottomLeftRadius = '5px';
        tooltip_img.style.borderBottomRightRadius = '5px';
        tooltipRef.current.appendChild(tooltip_img);
        // show tooltip
        // Show the tooltip with a fade-in transition
        tooltipRef.current.style.opacity = '1';
        tooltipRef.current.style.visibility = 'visible';

        // adding event listener to tooltip
        tooltipRef.addEventListener('click', () => {
          jump_to_page(pref_title);
        });
      });
      // resetting to original colors
      path.addEventListener('mouseout', () => {
        //fetches back the original colors from the original color array
        if (path !== current_selected_path) {
          path.style.fill = `${original_path_color}`;
          path.style.stroke = 'none';
        }
      });
    });
  }, []);

  useEffect(() => {
    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = '0';
      tooltipRef.current.style.visibility = 'hidden';
      tooltipRef.current.style.transition = 'opacity 0.3s ease-in-out';
    }
  }, []);

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <div>
        <ReactSVG
          ref={mapRef}
          beforeInjection={(svg) => getSvgInjectionElements(svg)}
          src={jpSvg}
          useRequestCache={false}
          fallback={() => <span>Error!</span>}
          // style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }}
        />
      </div>

      <div ref={tooltipRef} className="tooltip-container">
        <span>Kanto</span>
      </div>
    </div>
  );
};

export default SVGApproach;
