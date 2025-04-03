import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from '../util/util.js';

const app = express();

const port = process.env.PORT || 8082;

app.use(bodyParser.json());

app.get("/filteredimage", async (req, res) => {
  const imageUrl = req.query.image_url;
  if (!imageUrl) {
    return res.status(400).send({ message: "image_url is required" });
  }
  try {
    const filteredPath = await filterImageFromURL(imageUrl);
    res.sendFile(filteredPath, (err) => {
      if (err) {
        res.status(500).send({ message: "Error sending the file" });
      }
      deleteLocalFiles([filteredPath]);
    });
  } catch (error) {
    res.status(422).send({ message: "Unable to process image" });
  }
});

app.get( "/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}")
});

app.listen( port, () => {
  console.log( `server running http://localhost:${ port }` );
  console.log( `press CTRL+C to stop server` );
});