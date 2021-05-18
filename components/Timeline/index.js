import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { range } from 'lodash';
import { withLeapContainer } from 'react-leap';
import Leap from 'leapjs';
import {
  Flex,
  Box,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  IconButton,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndoAlt } from '@fortawesome/free-solid-svg-icons';

const Timeline = ({ handler, year, frame, setBlockMap, buttonRef }) => {
  const blockTimer = useRef(null);

  const minYear = 1600;
  const maxYear = 2020;
  const roundedMinYear = Math.ceil(minYear / 10) * 10;
  const roundedMaxYear = Math.floor(maxYear / 10) * 10;
  const yearRange = range(roundedMinYear, roundedMaxYear, 50);

  useEffect(() => {
    if (frame.valid && frame.gestures.length > 0) {
      frame.gestures.some(gesture => {
        if (gesture.type === 'circle') {
          clearTimeout(blockTimer.current);
          blockTimer.current = setTimeout(() => {
            setBlockMap(false);
          }, 1000);
          setBlockMap(true);

          let clockwise = -1;
          const pointableID = gesture.pointableIds[0];
          const { direction } = frame.pointable(pointableID);
          try {
            const dotProduct = Leap.vec3.dot(direction, gesture.normal);

            if (dotProduct > 0) clockwise = 1;
            let newYear = Math.round(year + (gesture.progress / 4) * clockwise);
            newYear = Math.min(maxYear, Math.max(minYear, newYear));
            if (newYear !== year) {
              return handler(newYear);
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
          }
        }
        return false;
      });
    }
  }, [frame]);

  return (
    <Flex
      pos="absolute"
      zIndex={999}
      bottom={10}
      alignItems="center"
      justifyContent="center"
      w="100vw"
    >
      <IconButton
        ref={buttonRef}
        icon={<FontAwesomeIcon icon={faUndoAlt} size="3x" />}
        w="100px"
        h="100px"
        mr={10}
        borderRadius="50%"
      />
      <Slider
        colorScheme="gray"
        aria-label="slider-ex-1"
        value={year}
        min={minYear}
        max={maxYear}
        onChange={handler}
        h="80px"
        w="calc(100vw - 170px)"
        maxW="1500px"
        opacity="0.75"
      >
        <Flex
          pos="relative"
          top="45px"
          zIndex={1}
          w="100%"
          pl={`${((roundedMinYear - minYear) / (maxYear - minYear)) * 100}%`}
          pr={`${((maxYear - roundedMaxYear) / (maxYear - minYear)) * 100}%`}
        >
          {yearRange.map(y => (
            <React.Fragment key={y}>
              <Box
                borderLeft="1px solid white"
                boxSizing="border-box"
                w={`${100 / (yearRange.length - 1)}%`}
                h="15px"
                lineHeight="25px"
                pl={1}
                fontSize={10}
                userSelect="none"
                visibility={y === minYear ? 'hidden' : 'visible'}
              >
                <Text
                  display="block"
                  color="white"
                  fontFamily="Open Sans"
                  fontWeight="bold"
                  fontSize="20px"
                  pos="relative"
                  bottom="30px"
                  right="30px"
                >
                  {y}
                </Text>
              </Box>
            </React.Fragment>
          ))}
        </Flex>
        <SliderTrack h="80px" borderRadius="40px">
          <SliderFilledTrack />
        </SliderTrack>
      </Slider>
    </Flex>
  );
};

Timeline.propTypes = {
  handler: PropTypes.func.isRequired,
  year: PropTypes.number.isRequired,
  setBlockMap: PropTypes.func.isRequired,
  frame: PropTypes.shape(),
  buttonRef: PropTypes.shape().isRequired,
};

Timeline.defaultProps = {
  frame: null,
};

export default withLeapContainer(Timeline);
