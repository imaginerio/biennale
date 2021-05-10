import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@chakra-ui/react';

const Views = ({ activeViews, pointers, handler }) => {
  const viewRef = useRef([]);
  const [highlighted, setHighlighted] = useState(null);

  useEffect(() => {
    const newHighlight = null;
    viewRef.current.some((view, i) => {
      if (view) {
        const { top, bottom, left, right } = view.getBoundingClientRect();
        pointers.some(pointer => {
          const { x, y } = pointer;
          if (x >= left && x <= right && y >= top && y <= bottom) {
            return handler(activeViews[i]);
          }
          return false;
        });
      }
      return false;
    });
    setHighlighted(newHighlight);
  }, [pointers]);

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
            backgroundImage={`url(${view.img})`}
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
  handler: PropTypes.func.isRequired,
};

Views.defaultProps = {
  pointers: [],
};

export default Views;
