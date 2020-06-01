const fetchMock = require('fetch-mock');
import obtainIPInfo from '../src/js/LocationInfo/obtainIPInfo';

const apiKeyIPInfo = 'ad4cb296462880';

describe('obtainIPInfo', () => {
  beforeEach(() => {
    fetch.resetMocks()
  })
  it ('should return JSON file with property "loc"', async () => {
    fetch.mockResponseOnce(JSON.stringify({ loc: '345, 567' }));
    const response = await obtainIPInfo(apiKeyIPInfo);
    expect(response.hasOwnProperty('loc')).toMatchSnapshot();
  });
});

