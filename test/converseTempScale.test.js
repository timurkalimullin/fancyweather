import conversetempScale from '../src/js/LocationInfo/converseTempScale';

describe('converseTempscale', () => {
  let converseTemp;
  beforeEach(() => {
    converseTemp = conversetempScale(10);
  });
  it ('should return something', () => {
    expect(converseTemp).toBeDefined();
  });
  it ('should return object {cel: "10.0", far: "50.0"}}', () => {
    expect(converseTemp).toEqual({cel: '10.0', far: '50.0'});
  });
});
