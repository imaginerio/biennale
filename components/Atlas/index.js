import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { isArray } from 'lodash';
import bbox from '@turf/bbox';
import ReactMapGL, {
  Source,
  Layer,
  NavigationControl,
  WebMercatorViewport,
  FlyToInterpolator,
} from 'react-map-gl';
import mapStyle from './style.json';

const Atlas = ({ year, activeView }) => {
  const mapRef = useRef(null);

  const [mapViewport, setMapViewport] = useState({
    longitude: -43.18769244446571,
    latitude: -22.90934766369527,
    zoom: 14,
  });

  const setMapYear = () => {
    const map = mapRef.current.getMap();
    let style = null;
    try {
      style = map.getStyle();
    } catch (err) {
      style = null;
    } finally {
      if (style) {
        style.layers = style.layers.map(layer => {
          if (layer.source === 'composite') {
            const filter = layer.filter
              ? layer.filter.filter(f => isArray(f) && f[0] !== '<=' && f[0] !== '>=')
              : [];
            return {
              ...layer,
              filter: [
                'all',
                ['<=', ['get', 'firstyear'], year],
                // ['>=', ['get', 'lastyear'], year],
                ...filter,
              ],
            };
          }
          return layer;
        });
        map.setStyle(style);
      }
    }
  };
  useEffect(setMapYear, [year]);

  const fitBounds = geom => {
    const [minX, minY, maxX, maxY] = bbox(geom);
    const { longitude, latitude, zoom } = new WebMercatorViewport(mapViewport).fitBounds(
      [
        [minX, minY],
        [maxX, maxY],
      ],
      { padding: 100 }
    );
    setMapViewport({
      ...mapViewport,
      longitude,
      latitude,
      zoom,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  const onViewportChange = nextViewport => {
    setMapViewport(nextViewport);
  };

  const onMapLoad = () => {
    setMapYear();
  };

  return (
    <ReactMapGL
      ref={mapRef}
      mapboxApiAccessToken="pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg"
      mapStyle={mapStyle}
      width="100%"
      height="100%"
      onLoad={onMapLoad}
      onViewportChange={onViewportChange}
      {...mapViewport}
    >
      {activeView && (
        <Source key={`view${activeView.id}`} type="geojson" data={activeView.geojson}>
          <Layer id="viewcone" type="fill" paint={{ 'fill-color': 'rgba(0,0,0,0.25)' }} />
        </Source>
      )}
      <div style={{ position: 'absolute', left: 15, top: 15 }}>
        <NavigationControl />
      </div>
    </ReactMapGL>
  );
};

Atlas.propTypes = {
  year: PropTypes.number.isRequired,
  activeView: PropTypes.shape(),
};

Atlas.defaultProps = {
  activeView: null,
};

export default Atlas;
