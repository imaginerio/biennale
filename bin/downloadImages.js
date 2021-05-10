/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const csvParse = require('csv-parse');
const axios = require('axios');

const parseAsync = promisify(csvParse);

async function downloadFile(fileUrl, outputLocationPath) {
  return axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  }).then(response => {
    response.data.pipe(fs.createWriteStream(outputLocationPath));
  });
}

const loadCSV = async () => {
  const csv = await fs.promises.readFile(path.join(process.cwd(), 'data/data.csv'), 'utf-8');
  const dataRaw = await parseAsync(csv, { columns: true });
  await dataRaw.reduce(async (previousPromise, data) => {
    await previousPromise;
    return downloadFile(
      data.img_hd,
      path.join(__dirname, '../public', data.img_hd.replace(/.*\//, ''))
    );
  });
  console.log('COMPLETE');
};

loadCSV();
