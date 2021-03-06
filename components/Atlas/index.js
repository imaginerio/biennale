import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { isArray } from 'lodash';
import bbox from '@turf/bbox';
import { withLeapContainer } from 'react-leap';
import ReactMapGL, { Source, Layer, WebMercatorViewport, FlyToInterpolator } from 'react-map-gl';

import mapStyle from './style.json';

const Atlas = ({
  size,
  year,
  selectedView,
  pointers,
  frame,
  blockMap,
  buttonRef,
  viewHandler,
  viewport,
}) => {
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
        viewHandler(null);
      }
    }
  };
  useEffect(setMapYear, [year]);

  const fitBounds = ({ geojson, bearing }) => {
    const [minX, minY, maxX, maxY] = bbox(geojson);
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
      zoom: Math.min(16.5, zoom),
      pitch: 60,
      bearing,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  useEffect(() => {
    if (selectedView) {
      fitBounds(selectedView);
    }
  }, [selectedView]);

  useEffect(() => {
    setMapViewport({
      ...mapViewport,
      ...size,
    });
  }, [size]);

  useEffect(() => {
    if (viewport) {
      setMapViewport({ ...size, ...viewport });
    }
  }, [viewport]);

  useEffect(() => {
    if (frame.valid && frame.gestures.length > 0) {
      frame.gestures.some(gesture => {
        if ((gesture.type === 'keyTap' || gesture.type === 'screenTap') && !blockMap) {
          const pointer = pointers.find(p => gesture.handIds.includes(p.handId));
          if (pointer) {
            const coords = mapRef.current.getMap().unproject([pointer.x, pointer.y]);
            setMapViewport({
              ...mapViewport,
              longitude: coords.lng,
              latitude: coords.lat,
              zoom: Math.min(16.5, mapViewport.zoom + 1),
              transitionDuration: 1000,
              transitionInterpolator: new FlyToInterpolator(),
            });
          }
        }
        return false;
      });
    }
  }, [frame]);

  useEffect(() => {
    const { top, bottom, left, right } = buttonRef.current.getBoundingClientRect();
    pointers.some(pointer => {
      const { x, y } = pointer;
      if (x >= left - 50 && x <= right + 50 && y >= top - 50 && y <= bottom + 50) {
        viewHandler(null);
        return setMapViewport({
          ...mapViewport,
          longitude: -43.18769244446571,
          latitude: -22.90934766369527,
          zoom: 14,
          pitch: 0,
          bearing: 0,
          transitionDuration: 1000,
          transitionInterpolator: new FlyToInterpolator(),
        });
      }
      return false;
    });
  }, [pointers]);

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
      onLoad={onMapLoad}
      onViewportChange={onViewportChange}
      {...mapViewport}
    >
      {selectedView && (
        <Source key={`view${selectedView.id}`} type="geojson" data={selectedView.geojson}>
          <Layer id="viewcone" type="fill" paint={{ 'fill-color': 'rgba(0,0,0,0.25)' }} />
        </Source>
      )}
    </ReactMapGL>
  );
};

Atlas.propTypes = {
  size: PropTypes.shape().isRequired,
  year: PropTypes.number.isRequired,
  selectedView: PropTypes.shape(),
  frame: PropTypes.shape(),
  pointers: PropTypes.arrayOf(PropTypes.shape()),
  blockMap: PropTypes.bool,
  buttonRef: PropTypes.shape().isRequired,
  viewHandler: PropTypes.func.isRequired,
  viewport: PropTypes.shape(),
};

Atlas.defaultProps = {
  selectedView: null,
  pointers: [],
  frame: null,
  blockMap: false,
  viewport: null,
};

export default withLeapContainer(Atlas);
