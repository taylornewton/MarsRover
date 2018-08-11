const express = require('express'),
  request = require('request-promise'),
  router = express.Router(),
  fs = require('fs');

const baseUrl = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos"
const params = "?camera=fhaz&api_key=DEMO_KEY";

router.get('/', (req, res) => {
  
  // Read Text File
  fs.readFile('input.txt', 'utf8', (e, data) => {
    if (e) throw e;
    const dates = data.split("\n");

    var promiseArray = [];
    dates.forEach(date => {
      var d = new Date(date);      
      var dateString = d.getUTCFullYear() + "-" 
        + (d.getUTCMonth() + 1) + "-" 
        + d.getUTCDate();
      
      promiseArray.push(GetPhotos(dateString));
    });

    // When photo requests return, process results
    Promise.all(promiseArray).then(results => {
      response = [];
      results.forEach(result => {
        pics = [];
        // Convert photos to custom objects
        const jsonResult = JSON.parse(result);
        jsonResult.photos.forEach(photo => {
          pics.push(new NasaPhoto(photo));
        });
        response.push(pics);
      });

      res.json(response);
    }, 
      e => { res.json(e) })
      .catch(x => { res.json(x) });
  });
});

function GetPhotos(date) {
  const url = baseUrl + params + "&earth_date=" + date;
  return request.get({ url: url });
}

class NasaPhoto {
  constructor(photo) {
    this.id = photo.id;
    this.date = photo.earth_date;
    this.src = photo.img_src;
    this.camera = photo.camera.name;
  }
};

module.exports = router;