import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Stack, Image, Grid, Box, IconButton } from '@chakra-ui/react';

const Viewer = ({ selectedView, pointers, viewHandler }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const { top, bottom, left, right } = buttonRef.current.getBoundingClientRect();
    pointers.some(pointer => {
      const { x, y } = pointer;
      if (x >= left - 25 && x <= right + 25 && y >= top - 25 && y <= bottom + 25) {
        return viewHandler(null);
      }
      return false;
    });
  }, [pointers]);

  return (
    <Stack
      h="100%"
      w="33vw"
      right={0}
      pos="absolute"
      backgroundColor="black"
      spacing={10}
      align="stretch"
    >
      <IconButton
        ref={buttonRef}
        icon={<FontAwesomeIcon icon={faArrowRight} size="4x" />}
        w="150px"
        h="150px"
        pos="absolute"
        top="75px"
        left="-75px"
        borderRadius="50%"
        colorScheme="blackAlpha"
      />
      <Image src={selectedView.img_hi} maxH="60vh" />
      <Grid color="white" px={10} templateColumns="repeat(2, 1fr)" gridGap={10}>
        {Object.keys(omit(selectedView, 'bearing', 'coordinates', 'geojson', 'id', 'img'))
          .filter(k => selectedView[k])
          .map(key => (
            <React.Fragment key={key}>
              <Box>
                <Box
                  textTransform="capitalize"
                  fontSize={75}
                  fontWeight="bold"
                  letterSpacing={-9}
                  color="rgba(255,255,255,0.75)"
                >
                  {key}
                </Box>
                <Box fontSize={30}>{selectedView[key]}</Box>
              </Box>
            </React.Fragment>
          ))}
      </Grid>
    </Stack>
  );
};

Viewer.propTypes = {
  selectedView: PropTypes.shape().isRequired,
  pointers: PropTypes.arrayOf(PropTypes.shape()),
  viewHandler: PropTypes.func.isRequired,
};

Viewer.defaultProps = {
  pointers: [],
};

export default Viewer;
