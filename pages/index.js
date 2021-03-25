import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { pick, map, uniq } from 'lodash';
import { Box, Flex } from '@chakra-ui/react';

import Atlas from '../components/Atlas';
import Hands from '../components/Hands';
import Views from '../components/Views';
import Timeline from '../components/Timeline';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const csvParse = require('csv-parse');
const parse = require('wellknown');

const parseAsync = promisify(csvParse);

const Home = ({ views, years }) => {
  const viewTimer = useRef();
  const [year, setYear] = useState(years[Math.round(years.length / 2)]);
  const [activeViews, setActiveViews] = useState(views.filter(v => v.year === year));
  const [selectedView, setSelectedView] = useState(null);
  const [pointers, setPointers] = useState([]);
  const [blockMap, setBlockMap] = useState(false);

  useEffect(() => {
    setActiveViews([]);
    clearTimeout(viewTimer.current);
    viewTimer.current = setTimeout(() => setActiveViews(views.filter(v => v.year === year)), 1000);
  }, [year]);

  return (
    <Box w="100vw" h="100vh">
      <Views
        activeViews={activeViews}
        pointers={pointers}
        handler={setSelectedView}
        setBlockMap={setBlockMap}
      />
      <Hands handler={setPointers} />
      <Atlas year={year} selectedView={selectedView} blockMap={blockMap} pointers={pointers} />
      <Timeline year={year} handler={setYear} />
      <Flex pos="absolute" zIndex={9} top={10} left={5} fontFamily="Open Sans" fontWeight="bold">
        <Box
          fontSize={110}
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
          fontSize={150}
          lineHeight="150px"
          letterSpacing="-30px"
          color="rgba(30,30,30,0.7)"
          borderLeft="5px solid #CC26B2"
        >
          {year}
        </Box>
      </Flex>
    </Box>
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
    ...pick(d, 'id', 'title', 'description', 'creator', 'place', 'img_hd', 'img_sd'),
    year: parseInt(d.date.match(/\d{4}/)[0], 10),
    coordinates: [parseFloat(d.lng), parseFloat(d.lat)],
    geojson: parse(d.geometry),
  }));
  const years = uniq(map(views, 'year')).sort((a, b) => a - b);

  return {
    props: { views, years },
  };
}
