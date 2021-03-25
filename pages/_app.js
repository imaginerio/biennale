/* eslint-disable react/prop-types */
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { LeapProvider } from 'react-leap';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <LeapProvider options={{ enableGestures: true }}>
        <Component {...pageProps} />
      </LeapProvider>
    </ChakraProvider>
  );
}

export default MyApp;
