import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Image, Heading } from '@chakra-ui/react';

const Sidebar = ({ views, index }) => (
  <>
    {views && views[index] && (
      <Box p={5}>
        <Image
          src={`https://highwayswaterways-images.s3.us-east-1.amazonaws.com/${views[index].ssid}/medium.jpg`}
        />
        <Heading size="md" mt={4}>
          {views[index].title}
        </Heading>
        <Box>
          <Grid templateColumns="repeat(3, 82px)" columnGap="15px" rowGap="15px" mt={5}>
            {views.map((d, i) => (
              <Box
                key={d.ssid}
                w="82px"
                h="82px"
                pos="relative"
                bgImage={`url(https://highwayswaterways-images.s3.us-east-1.amazonaws.com/${d.ssid}/thumb.jpg)`}
                border={i === index ? '5px solid black' : 'none'}
                bgSize="cover"
              />
            ))}
          </Grid>
        </Box>
      </Box>
    )}
  </>
);

Sidebar.propTypes = {
  views: PropTypes.arrayOf(PropTypes.shape()),
  index: PropTypes.number,
};

Sidebar.defaultProps = {
  views: [],
  index: 0,
};

export default Sidebar;
