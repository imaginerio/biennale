import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { isArray } from 'lodash';
import bbox from '@turf/bbox';
import { withLeapContainer } from 'react-leap';
import ReactMapGL, { Source, Layer, WebMercatorViewport, FlyToInterpolator } from 'react-map-gl';
import { IconButton } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndoAlt } from '@fortawesome/free-solid-svg-icons';

import mapStyle from './style.json';

const Atlas = ({ year, selectedView, pointers, frame, blockMap }) => {
  const mapRef = useRef(null);
  const buttonRef = useRef(null);

  const [mapViewport, setMapViewport] = useState({
    longitude: -43.18769244446571,
    latitude: -22.90934766369527,
    zoom: 14,
  });
  const [buttonHighlight, setButtonHighlight] = useState(false);

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
      pitch: 60,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  useEffect(() => {
    if (selectedView) {
      fitBounds(selectedView.geojson);
    }
  }, [selectedView]);

  useEffect(() => {
    if (frame.valid && frame.gestures.length > 0) {
      frame.gestures.some(gesture => {
        if ((gesture.type === 'keyTap' || gesture.type === 'screenTap') && !blockMap) {
          const pointer = pointers.find(p => gesture.handIds.includes(p.handId));
          if (pointer) {
            if (buttonHighlight) {
              setMapViewport({
                ...mapViewport,
                longitude: -43.18769244446571,
                latitude: -22.90934766369527,
                zoom: 14,
                pitch: 0,
                transitionDuration: 1000,
                transitionInterpolator: new FlyToInterpolator(),
              });
            } else {
              const coords = mapRef.current.getMap().unproject([pointer.x, pointer.y]);
              setMapViewport({
                ...mapViewport,
                longitude: coords.lng,
                latitude: coords.lat,
                zoom: mapViewport.zoom + 1,
                transitionDuration: 1000,
                transitionInterpolator: new FlyToInterpolator(),
              });
            }
          }
        }
        return false;
      });
    }
  }, [frame]);

  useEffect(() => {
    let highlighted = false;
    const { top, bottom, left, right } = buttonRef.current.getBoundingClientRect();
    highlighted = pointers.some(pointer => {
      const { x, y } = pointer;
      return x >= left - 50 && x <= right + 50 && y >= top - 50 && y <= bottom + 50;
    });
    setButtonHighlight(highlighted);
  }, [pointers]);

  const onViewportChange = nextViewport => {
    setMapViewport(nextViewport);
  };

  const onMapLoad = () => {
    setMapYear();
  };

  return (
    <>
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
        {selectedView && (
          <Source key={`view${selectedView.id}`} type="geojson" data={selectedView.geojson}>
            <Layer id="viewcone" type="fill" paint={{ 'fill-color': 'rgba(0,0,0,0.25)' }} />
          </Source>
        )}
      </ReactMapGL>
      <IconButton
        ref={buttonRef}
        icon={<FontAwesomeIcon icon={faUndoAlt} size="3x" />}
        pos="absolute"
        w="100px"
        h="100px"
        bottom="40px"
        left="20px"
        borderRadius="50%"
        border={buttonHighlight ? '5px solid black' : 'none'}
      />
    </>
  );
};

Atlas.propTypes = {
  year: PropTypes.number.isRequired,
  selectedView: PropTypes.shape(),
  frame: PropTypes.shape(),
  pointers: PropTypes.arrayOf(PropTypes.shape()),
  blockMap: PropTypes.bool,
};

Atlas.defaultProps = {
  selectedView: null,
  pointers: [],
  frame: null,
  blockMap: false,
};

export default withLeapContainer(Atlas);
