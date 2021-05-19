/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { SizeMe } from 'react-sizeme';
import { pick, map, uniq, random } from 'lodash';
import { FlyToInterpolator } from 'react-map-gl';
import { Box, Flex } from '@chakra-ui/react';

import Atlas from '../components/Atlas';
import Hands from '../components/Hands';
import Views from '../components/Views';
import Timeline from '../components/Timeline';
import Viewer from '../components/Viewer';

import useInterval from '../lib/useInterval';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const csvParse = require('csv-parse');
const parse = require('wellknown');

const parseAsync = promisify(csvParse);

const Home = ({ views, years }) => {
  const viewTimer = useRef(null);
  const buttonRef = useRef(null);
  const yearTimer = useRef(null);
  const imageTimer = useRef(null);

  const [year, setYear] = useState(years[Math.round(years.length / 2)]);
  const [activeViews, setActiveViews] = useState(views.filter(v => v.year === year));
  const [selectedView, setSelectedView] = useState(null);
  const [pointers, setPointers] = useState([]);
  const [blockMap, setBlockMap] = useState(false);
  const [videoOpen, setVideoOpen] = useState(true);
  const [introRunning, setIntroRunning] = useState(false);
  const [introInterval, setIntroInterval] = useState(15000);
  const [viewport, setViewport] = useState(null);

  useEffect(() => {
    if (!introRunning) setActiveViews([]);
    clearTimeout(viewTimer.current);
    viewTimer.current = setTimeout(() => setActiveViews(views.filter(v => v.year === year)), 1000);
  }, [year]);

  useInterval(() => {
    setVideoOpen(true);
    setIntroRunning(true);
    const img = views[random(views.length - 1)];
    clearTimeout(yearTimer.current);
    yearTimer.current = setTimeout(() => {
      setYear(img.year);
      setSelectedView(null);
    }, 5000);

    clearTimeout(imageTimer.current);
    imageTimer.current = setTimeout(() => setSelectedView(img), 10000);
  }, introInterval);

  useEffect(() => {
    if (pointers.length && introRunning) {
      setIntroRunning(false);
      setIntroInterval(null);
      clearTimeout(yearTimer.current);
      clearTimeout(imageTimer.current);
      setTimeout(() => setVideoOpen(false), 5000);
      setSelectedView(null);
      if (!viewport) {
        setViewport({
          longitude: -43.18769244446571,
          latitude: -22.90934766369527,
          zoom: 14,
          pitch: 0,
          bearing: 0,
          transitionDuration: 1000,
          transitionInterpolator: new FlyToInterpolator(),
        });
      }
    } else if (!pointers.length && !introRunning) {
      setIntroInterval(15000);
    }
  }, [pointers]);

  return (
    <Flex w="100vw" h="100vh">
      {!selectedView && (
        <Views activeViews={activeViews} pointers={pointers} handler={setSelectedView} />
      )}
      <Hands handler={setPointers} />
      <SizeMe monitorWidth monitorHeight>
        {({ size }) => (
          <Box w="100vw">
            <Atlas
              size={size}
              year={year}
              selectedView={selectedView}
              viewHandler={setSelectedView}
              blockMap={blockMap}
              pointers={pointers}
              buttonRef={buttonRef}
              viewport={viewport}
            />
          </Box>
        )}
      </SizeMe>
      {selectedView && (
        <Viewer selectedView={selectedView} pointers={pointers} viewHandler={setSelectedView} />
      )}
      {videoOpen && (
        <Flex
          pos="absolute"
          zIndex={9999}
          w="480px"
          h="calc(100vh - 160px)"
          top={280}
          left="40px"
          opacity={0.9}
          alignItems="flex-start"
          justifyContent="flex-end"
        >
          <video src="/demo.mp4" preload="auto" autoPlay loop muted />
        </Flex>
      )}
      <Timeline
        year={year}
        handler={setYear}
        setBlockMap={setBlockMap}
        buttonRef={buttonRef}
        hide={selectedView}
      />
      <Flex pos="absolute" zIndex={9} top={10} left={5} fontFamily="Open Sans" fontWeight="bold">
        <Box
          fontSize={140}
          letterSpacing="-20px"
          color="rgba(204,38,178, 0.6)"
          transform="rotate(-90deg)"
          pos="relative"
          top={3}
          right={2}
        >
          Rio
        </Box>
        <Box
          fontSize={200}
          lineHeight="200px"
          letterSpacing="-40px"
          color="rgba(30,30,30,0.7)"
          borderLeft="5px solid #CC26B2"
        >
          {year}
        </Box>
      </Flex>
    </Flex>
  );
};

Home.propTypes = {
  views: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  years: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Home;

export async function getStaticProps() {
  const csv = await fs.promises.readFile(path.join(process.cwd(), 'data/data.csv'), 'utf-8');
  const dataRaw = await parseAsync(csv, { columns: true });
  const views = dataRaw.map(d => ({
    ...pick(d, 'id', 'title', 'creator', 'place'),
    bearing: parseFloat(d.heading),
    year: parseInt(d.date.match(/\d{4}/)[0], 10),
    img: `/img/${d.img_hd.replace(/.*\//, '')}`,
    coordinates: [parseFloat(d.lng), parseFloat(d.lat)],
    geojson: parse(d.geometry),
  }));
  const years = uniq(map(views, 'year')).sort((a, b) => a - b);

  return {
    props: { views, years },
  };
}
