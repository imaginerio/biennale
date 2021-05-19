import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import { Stack, Image, Grid, Box } from '@chakra-ui/react';

const Viewer = ({ selectedView }) => (
  <Stack
    h="100%"
    w="33vw"
    right={0}
    pos="absolute"
    backgroundColor="black"
    spacing={10}
    align="stretch"
  >
    <Image src={selectedView.img} maxH="60vh" />
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

Viewer.propTypes = {
  selectedView: PropTypes.shape().isRequired,
};

export default Viewer;
