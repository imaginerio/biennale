import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { pick, map, uniq } from 'lodash';
import { Box } from '@chakra-ui/react';

import Atlas from '../components/Atlas';

const Hands = dynamic(() => import('../components/Hands'), {
  ssr: false,
});

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const csvParse = require('csv-parse');
const parse = require('wellknown');

const parseAsync = promisify(csvParse);

const Home = ({ views, years }) => {
  const [year, setYear] = useState(years[Math.round(years.length / 2)]);
  const [activeViews, setActiveViews] = useState(views.filter(v => v.year === year));

  useEffect(() => {
    setActiveViews(views.filter(v => v.year === year));
  }, [year]);

  return (
    <Box w="100vw" h="100vh">
      <Hands />
      <Atlas />
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
    ...pick(d, 'id', 'title', 'description', 'creator', 'place', 'image_hd', 'image_sd'),
    year: parseInt(d.date.match(/\d{4}/)[0], 10),
    coordinates: [parseFloat(d.lng), parseFloat(d.lat)],
    geojson: parse(d.geometry),
  }));
  const years = uniq(map(views, 'year')).sort((a, b) => a - b);

  return {
    props: { views, years },
  };
}
