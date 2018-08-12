function GetImages() {
  $('#getPhotos').attr('disabled', 'disabled');
  $.ajax({
    url: '/photos',
    success: function(result) {
      if (result.statusCode != 200) {
        $('#getPhotos').removeAttr('disabled');
        if (result.statusCode == 429) {
          showErrorMessage('NASA rate limit has been exceeded. Please use private API Key.');
        } else {
          showErrorMessage('An error has occurred.');
          console.log('An error occurred: ' + result.message);
        }
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
}

function showErrorMessage(message) {
  $('#errorMessage').show();
  $('#errorMessage').text(message);
}