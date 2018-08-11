$.ajax({
  url: '/photos',
  success: function(result) {
    if (result.statusCode != 200) {
      console.log('An error occurred: ' + result.message);
      return;
    }
    result.photos.forEach(element => {
      element.forEach(photo => {
        $('#results').append('<div class="photo-wrapper"><p>'
          + photo.date + ' ' + '(sol ' + photo.sol + ') ' + photo.camera
          +'</p><img height="400" src="' + photo.src + '"></div>');
      });
    });
  }
});