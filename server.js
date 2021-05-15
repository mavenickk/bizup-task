import express from "express";
import Cors from 'cors';
import request from 'request';
import vision from '@google-cloud/vision';
import getColors from 'get-image-colors';
import ColorThief from 'colorthief';
//import bodyParser from 'body-parser';
//import async from 'async';

// app config
const app = express();
const port = process.env.PORT || 8000;

// middleware
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json());

app.use(Cors());



var rgbToHex = function (rgb) { 
  var hex = Number(rgb).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
};

var fullColorHex = function(r,g,b) {   
  var red = rgbToHex(r);
  var green = rgbToHex(g);
  var blue = rgbToHex(b);
  return '#'+red+green+blue;
};

app.get('/', function (req, res) {
  var src = req.query.src;
  for (var i = 0; i < src.length; i++) {
    src = src.replace(" ", "%20");
  }

  console.log(src);

  ColorThief.getPalette(src, 10)
    .then(palette => {
      console.log(palette)
      var dom = fullColorHex(palette[0][0], palette[0][1], palette[0][2]);
      var border = fullColorHex(palette[9][0], palette[9][1], palette[9][2]);
      var ans={
        'logo_border': border,
        'dominant_color': dom
      }
      res.send(ans);
     })
    .catch(err => { console.log(err) })
});




app.listen(port, () => console.log(`Listening on localhost: ${port} `));









// app.post('/', function (request, response) {
//     var src = request.body.src;
//     console.log(src);
//     for (var i = 0; i < src.length; i++) {
//         src = src.replace(" ", "%20");
//     }
//     console.log(src);
//     response.send(src);  

//     // const options = {
//     //     method: 'POST',
//     //     url: src,
//     //     headers: {
//     //         'content-type': 'multipart/form-data; boundary=---011000010111000001101001',
//     //         'x-rapidapi-key': 'SIGN-UP-FOR-KEY',
//     //         'x-rapidapi-host': 'color-from-picture.p.rapidapi.com',
//     //         useQueryString: true
//     //     },
//     //     formData: { image: {} }
//     // };

//     // request(options, function (error, response, body) {
//     //     if (error) throw new Error(error);

//     //     console.log(body);
//     // });
// });
// const client = new vision.ImageAnnotatorClient();
//     async function quickstart() {
//         const features = [{type: 'IMAGE_PROPERTIES'}];
//         const imageRequest = {
//             image: {
//               source: {
//                 imageUri: src,
//               },
//             },
//             features: features,
//           };
//         const [result] = await client.imageProperties(
//             'test.jpeg'
//         );
//         const colors = result.imagePropertiesAnnotation.dominantColors.colors;
//         colors.forEach(color => console.log(color));
//       }
//       quickstart();