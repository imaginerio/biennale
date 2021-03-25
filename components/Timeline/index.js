import React from 'react';
import PropTypes from 'prop-types';
import { range, last } from 'lodash';
import { Flex, Box, Text, Slider, SliderTrack, SliderFilledTrack } from '@chakra-ui/react';

const Timeline = ({ handler, year, years }) => {
  const [minYear] = years;
  const maxYear = last(years);
  const roundedMinYear = Math.ceil(minYear / 10) * 10;
  const roundedMaxYear = Math.floor(maxYear / 10) * 10;
  const yearRange = range(roundedMinYear, roundedMaxYear, 10);

  return (
    <Slider
      colorScheme="gray"
      aria-label="slider-ex-1"
      value={year}
      min={minYear}
      max={maxYear}
      onChange={handler}
      h="80px"
      pos="absolute"
      bottom={120}
      w="80vw"
      left="10vw"
      zIndex={999}
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
  );
};

Timeline.propTypes = {
  handler: PropTypes.func.isRequired,
  year: PropTypes.number.isRequired,
  years: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Timeline;
