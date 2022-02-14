const { time } = require("console");
const exampleWalletAddress = "0xc8365045cd8be7b84d9cb5cf83ac2d18bece7116";


/*
  FUNCTION: createGif()
    Uses Gifshot JS library to process an array of URLS into a gif
    that is outputted to the webpage
*/
function createGif(photos, timeLengthForEachImage) {
  var imageArray = [];

  for(var n = 0; n < photos.length; n++)
  {
    imageArray[n] = photos[n].image_url;
  }

  gifshot.createGIF({
    'images': imageArray,
    'gifWidth': 500,
    'gifHeight': 500,
    'interval': timeLengthForEachImage
  },function(obj) {
    if(!obj.error) {
      var image = obj.image,
      animatedImage = document.createElement('img');
      animatedImage.src = image;
      animatedImage.alt = "Gif not loaded";
      document.body.appendChild(animatedImage);
    }
  });
}

/*
  FUNCTION: fetchOSInfo()
    Uses Opensea's Testnet API to retrieve wallet information
    including an array of the wallet's NFTs, then the function
    calls the createGif function
*/
function fetchOSInfo(address, timeLengthForEachImage) {
  return new Promise((resolve, reject) => {
      const options = {method: 'GET'};

      // fetch data from opensea's testnet api
      fetch('https://testnets-api.opensea.io/api/v1/assets?owner=' + address + '&order_direction=desc&offset=0&limit=20', options)
      .then(response => {

          //check if wallet address is valid
          if(response.status == 400)
          {
            alert("error processing wallet, please enter a valid adress starting with 0x ");
            return;
          }
          return response.json();
      })
      .then(data => {
          ///check if wallet is empty
          if(data.assets.length == 0)
          {
            alert("wallet has no NFTs, must use Testnet wallet");
            return;
          }
          resolve(data.assets);

          return createGif(data.assets, timeLengthForEachImage);
      })    
      .catch(err => console.error(err)); 
   })       
}

/*
  FUNCTION: myFunction()
    Main javascript function that stores user inputted elements
    and calls functions that fetch api data and then creates a gif
    of the pictures that are provided.
*/
function myFunction(){

    //store wallet address and gif interval
    var address = document.getElementById("walletAddress").value;
    var timeLengthForEachImage = document.getElementById("speedOfGif").value;

    /*check if time length is valid, if empty set to 5, if greater than 10 then 
        change to 10, if less than 1 then change to 1 */
    if(timeLengthForEachImage == '')
    {
      timeLengthForEachImage = 5;
    }
    else if(timeLengthForEachImage > 10)
    {
      timeLengthForEachImage = 10;
    }
    else if(timeLengthForEachImage < 1)
    {
      timeLengthForEachImage = 1;
    }

    //convert time to a 1-10 bound, 1 being slowest speed, 10 being fastest speed
    timeLengthForEachImage = (1.1 - 0.1 * (timeLengthForEachImage));

    const options = {method: 'GET'};

    const result = fetchOSInfo(address, timeLengthForEachImage);
}