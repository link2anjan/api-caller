// Import required packages
const express = require("express");
const app = express();
const axios = require("axios");
const cors = require('cors');
const dotenv = require('dotenv'); // Import dotenv package
const { header } = require("express/lib/request");

// Load environment variables from .env file
dotenv.config();

// Enable CORS
app.use(cors());

// Parse JSON body in requests
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static("public"));

// Define the API route
app.post("/api/call-api", async (req, res) => {
  const showResult = req.body.showResult;
  //const apiUrl = process.env.API_URL; // Get API URL from environment variable or default
  const apiUrl = req.body.apiUrl;
  console.log(apiUrl+" method: "+req.body.method+" headers: "+req.body.headers+" body: "+req.body.body);
  try {
    const method = req.body.method.toLowerCase();
    const headers = extractHeaders(req.body.headers); // Extract and clean headers
    let response;
    let config;
    let flag = true;
    if (method === 'get') {
        flag = false;
        if(showResult){
            response = await axios.get(apiUrl, { headers });
            res.json(response.data)
        }else{
            axios.get(apiUrl, { headers });
            res.sendStatus(200);
        }
    } else if (method === 'post') {
          config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: apiUrl,
            headers: headers,
            data : req.body.body
          };
    } else if (method === 'put') {
          config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: apiUrl,
            headers: headers,
            data : req.body.body
          };
    } else if (method === 'delete') {
        flag = false;
        if(showResult){
            response = await axios.delete(apiUrl, { headers });
            res.json(response.data)
        }else{
            axios.delete(apiUrl, { headers });
            res.sendStatus(200);
        }
    } else if (method === 'patch') {
         config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: apiUrl,
            headers: headers,
            data : req.body.body
          };
    }
    if(flag){
        if (showResult) {
            axios.request(config)
            .         then((response) => {
                          res.json(response.data)
                  }).catch((error) => {
                        res.status(500).json({ message: "Error calling the backend API:-> "+error });
                  });
        } else {
            axios.request(config);
            res.sendStatus(200);
        }
    }
  } catch (error) {
    res.status(500).json({ message: "Error calling the API." });
  }
});

//-----------------------------------
// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Function to extract and clean headers
function extractHeaders(headers) {
  const cleanedHeaders = {};

  for (const [key, value] of Object.entries(headers)) {
    if (value !== null && value !== undefined) {
      cleanedHeaders[key] = value;
    }
  }
  cleanedHeaders['Content-Type'] = 'application/json';
  return cleanedHeaders;
}
