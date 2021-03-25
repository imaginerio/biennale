import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@chakra-ui/react';

const Views = ({ activeViews }) => (
  <Box pos="absolute" zIndex={9} top={0} right={0}>
    {activeViews.map(view => (
      <Box key={view.id} m={5}>
        <Box
          w="15vw"
          h="15vw"
          border="6px solid rgba(255, 255, 255, 0.6)"
          borderRadius="50%"
          pos="absolute"
        />
        <Box
          w="15vw"
          h="15vw"
          backgroundImage={`url(${view.img_hd})`}
          backgroundSize="200%"
          backgroundPosition="center"
          borderRadius="50%"
        />
      </Box>
    ))}
  </Box>
);

Views.propTypes = {
  activeViews: PropTypes.shape().isRequired,
};

export default Views;
