const express = require('express'),
  http = require('http'),
  request = require('request-promise'),
  router = express.Router(),
  fs = require('fs');

const cameraName = "fhaz";
const roverName = "curiosity";
const apiKey = "DEMO_KEY";
const baseUrl = "https://api.nasa.gov/mars-photos/api/v1/rovers/" + roverName + "/photos"
const params = "?camera=" + cameraName + "&api_key=" + apiKey;
const img_dir = "images/";

/**
 * Retrieves photos from NASA Mars Photos API, downloads each locally,
 * and retuns NASA Photos objects for display on webpage.
 */
router.get('/', (req, res) => {
  // Read Text File
  fs.readFile('input.txt', 'utf8', (e, data) => {
    if (e) throw e;
    const dates = data.split("\n");

    var promiseArray = [];
    dates.forEach(date => {
      const dateString = FormatDate(date);
      promiseArray.push(GetPhotos(dateString));
    });

    // When photo requests return, process results
    Promise.all(promiseArray).then(results => {
      response = {
        statusCode: 200,
        photos: []
      };
      // Process results from each date request
      results.forEach(result => {
        response.photos.push(GetPhotosFromResult(result));
      });
      
      res.json(response);

    }, e => { 
      console.log('Error occurred retrieving photos: ' + e);
      res.json(e);
    }).catch(x => { 
      console.log('Exception thrown retrieving photos: ' + x);
      res.json(x);
    });
  });
});

/**
 * Accepts a date string and returns it formatted as YYYY-MM-DD
 * @param {String} date 
 *    string representation of a date
 * @returns {string}
 *    new string representing date, formatted as YYYY-MM-DD
 */
function FormatDate(date) {
  var d = new Date(date);      
  var dateString = d.getUTCFullYear() + "-" 
    + (d.getUTCMonth() + 1) + "-" 
    + d.getUTCDate();
  // TODO fix off by one error
  return dateString;
}

/**
 * Gets photos from NASA API for the requested date
 * @param {string} dateString 
 *    YYYY-MM-DD format
 * @return {Promise}
 *    promise of result from API call
 */
function GetPhotos(dateString) {
  const url = baseUrl + params + "&earth_date=" + dateString;
  return request.get({ url: url });
}

/**
 * Returns a list of NasaPhotos from the API result
 * @param {object} result 
 *    response from API call
 * @returns {NasaPhoto[]}
 *    list of NasaPhotos parsed from result
 */
function GetPhotosFromResult(result) {
  pics = [];
  // Convert photos to custom objects
  const jsonResult = JSON.parse(result);
  jsonResult.photos.forEach(photo => {
    const pic = new NasaPhoto(photo);
    pics.push(pic);
    DownloadPhoto(pic);
  });
  return pics;
}

/**
 * Download photo to local machine
 * @param {NasaPhoto} photo 
 */
function DownloadPhoto(photo) {
  const idx = photo.src.lastIndexOf('.');
  const ext = photo.src.substring(idx);

  if (!fs.existsSync(img_dir + photo.date)) {
    if (!fs.existsSync(img_dir)) {
      fs.mkdirSync(img_dir);
    }
    fs.mkdirSync(img_dir + photo.date);
  }

  const path = img_dir + photo.date + '/' + photo.id + ext;
  const file = fs.createWriteStream(path);

  http.get(photo.src, (response) => {
    response.pipe(file);
    file.on('finish', function() {
      console.log('File download complete: ' + path);
      file.close();
    });
  }).on('error', (err) => {
    console.log('Error occurred downloading file: ' + err);
    fs.unlink(path);
  });
}

/**
 * @prop {number} id
 *    unique photo id
 * @prop {string} date
 *    "earth date" of the photo
 * @prop {number} sol
 *    sol number of the photo
 * @prop {string} src
 *    image source of photo
 * @prop {string} camera 
 *    name of camera that took the photo
 */
class NasaPhoto {
  constructor(photo) {
    this.id = photo.id;
    this.date = photo.earth_date;
    this.sol = photo.sol;
    this.src = photo.img_src;
    this.camera = photo.camera.name;
  }
};

module.exports = router;