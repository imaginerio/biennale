import React from 'react';
import PropTypes from 'prop-types';
import { range } from 'lodash';
import {
  Flex,
  Box,
  Heading,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';

import config from '../../config';

const { minYear, maxYear } = config;
const roundedMinYear = Math.ceil(minYear / 10) * 10;
const roundedMaxYear = Math.floor(maxYear / 10) * 10;
const yearRange = range(roundedMinYear, roundedMaxYear, 10);

const Timeline = ({ handler, year }) => (
  <Flex py={5} pr={5} boxShadow="0 2px 2px rgba(0,0,0,0.25)" pos="relative" zIndex={2}>
    <Flex>
      <Heading w="100px" textAlign="center" mx={5}>
        {year}
      </Heading>
    </Flex>
    <Slider
      colorScheme="gray"
      aria-label="slider-ex-1"
      value={year}
      min={minYear}
      max={maxYear}
      onChange={handler}
      h="40px"
    >
      <Flex
        pos="relative"
        top="-12px"
        zIndex={1}
        w="100%"
        pl={`${((roundedMinYear - minYear) / (maxYear - minYear)) * 100}%`}
        pr={`${((maxYear - roundedMaxYear) / (maxYear - minYear)) * 100}%`}
      >
        {yearRange.map(y => (
          <React.Fragment key={y}>
            <Box
              borderLeft="1px solid black"
              boxSizing="border-box"
              w={`${100 / (yearRange.length - 1)}%`}
              h="25px"
              lineHeight="25px"
              pl={1}
              fontSize={10}
              userSelect="none"
            >
              {y}
            </Box>
          </React.Fragment>
        ))}
      </Flex>
      <SliderTrack h="30px">
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb h="100%" w="16px" />
    </Slider>
  </Flex>
);

Timeline.propTypes = {
  handler: PropTypes.func.isRequired,
  year: PropTypes.number.isRequired,
};

export default Timeline;
