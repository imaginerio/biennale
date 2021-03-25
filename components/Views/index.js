import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withLeapContainer } from 'react-leap';
import { Box } from '@chakra-ui/react';

const Views = ({ activeViews, pointers, frame, handler }) => {
  const viewRef = useRef([]);
  const [highlighted, setHighlighted] = useState(null);

  useEffect(() => {
    let newHighlight = null;
    viewRef.current.some((view, i) => {
      if (view) {
        const { top, bottom, left, right } = view.getBoundingClientRect();
        if (
          pointers.some(pointer => {
            const { x, y } = pointer;
            return x >= left - 50 && x <= right + 50 && y >= top - 50 && y <= bottom + 50;
          })
        ) {
          newHighlight = i;
          return true;
        }
      }
      return false;
    });
    setHighlighted(newHighlight);
  }, [pointers]);

  useEffect(() => {
    if (frame.valid && frame.gestures.length > 0) {
      frame.gestures.some(gesture => {
        if (gesture.type === 'keyTap' || (gesture.type === 'screenTap' && highlighted)) {
          handler(activeViews[highlighted]);
        }
        return false;
      });
    }
  }, [frame]);

  return (
    <Box pos="absolute" zIndex={9} top={0} right={0}>
      {activeViews.slice(0, 5).map((view, i) => (
        <Box
          key={view.id}
          m={5}
          ref={el => {
            viewRef.current[i] = el;
          }}
        >
          <Box
            w="15vw"
            h="15vw"
            border="6px solid"
            borderColor={highlighted === i ? 'black' : 'rgba(255, 255, 255, 0.6)'}
            borderRadius="50%"
            pos="absolute"
          />
          <Box
            w="15vw"
            h="15vw"
            backgroundImage={`url(${view.img_sd})`}
            backgroundSize="200%"
            backgroundPosition="center"
            borderRadius="50%"
          />
        </Box>
      ))}
    </Box>
  );
};

Views.propTypes = {
  activeViews: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  pointers: PropTypes.arrayOf(PropTypes.shape()),
  frame: PropTypes.shape(),
  handler: PropTypes.func.isRequired,
};

Views.defaultProps = {
  pointers: [],
  frame: null,
};

export default withLeapContainer(Views);
