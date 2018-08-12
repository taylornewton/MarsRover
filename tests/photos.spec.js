const rewire = require('rewire');

const photosController = rewire('../controllers/photos.js');

describe('Controllers: photos.js', () => {

  describe('FormatDate()', () => {
    const FormatDate = photosController.__get__('FormatDate');

    it('formats abbreviated dates correctly', () => {
      const result = FormatDate('3/1/01');
      expect(result).toEqual('2001-03-01');
    });

    it('formats spelled out dates correctly', () => {
      const result = FormatDate('March 18, 2018');
      expect(result).toEqual('2018-03-18');
    });

    it('formats month abbr dates correctly', () => {
      const result = FormatDate('Sep 2, 1999');
      expect(result).toEqual('1999-09-02');
    });

    it('formats dashed dates correctly', () => {
      const result = FormatDate('Jan-01-01');
      expect(result).toEqual('2001-01-01');
    });

    it('reformats invalid dates', () => {
      const result = FormatDate('Feb 30, 2018');
      // This will fail in some browsers! 
      expect(result).toEqual('2018-03-02');
    });

    it('handles invalid input', () => {
      const result = FormatDate('foo');
      expect(result).toBeNull();
    });
  });

  describe('GetPhotos()', () => {
    const baseUrl = 'https://api.nasa.gov';
    photosController.__set__('baseUrl', baseUrl);

    it('requests correct url', () => {
      photosController.__set__('request', {
        get: ({ url }) => {
          expect(url).toEqual(baseUrl + '&earth_date=' + '2000-05-03');
        }
      });
      const GetPhotos = photosController.__get__('GetPhotos');
      GetPhotos('2000-05-03');
    });
  });

  describe('GetPhotosFromResult()', () => {
    const GetPhotosFromResult = photosController.__get__('GetPhotosFromResult');
    const data = {
      photos: [
      {
        id: 1, 
        earth_date: '2005-04-14', 
        sol: 123, 
        img_src: 'pic.jpg', 
        camera: { name: 'front' }
      },
      {
        id: 2, 
        earth_date: '2005-11-20', 
        sol: 456, 
        img_src: 'pic2.jpg', 
        camera: { name: 'front' }
      }
    ]};

    it('should return array of NasaPhotos', () => {
      photosController.__set__('DownloadPhoto', (photo) => {});
      const result = GetPhotosFromResult(JSON.stringify(data));
      expect(result.length).toEqual(2);
      expect(result[0]).toEqual(jasmine.objectContaining({
        id: 1,
        date: '2005-04-14',
        sol: 123,
        src: 'pic.jpg',
        camera: 'front'
      }));
    });

    it('should call DownloadPhoto with each NasaPhoto', () => {
      const spy = jasmine.createSpy('DownloadPhoto');
      photosController.__set__('DownloadPhoto', spy);

      GetPhotosFromResult(JSON.stringify(data));
      expect(spy.calls.length).toEqual(2);
    });
  });
});