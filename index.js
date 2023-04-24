const { CosmosClient } = require('@azure/cosmos');

const endpoint = 'https://iottesta.documents.azure.com:443/';
const key = 'KtxTrpEnY3otrMOOCe9M88T4LrmWFsZdogoV7v814F8loGEgQS4Q33qWJFk75pTtTJhfHY75Ibg8ACDbBxGU2Q==';
const databaseId = 'my-database';
const containerId = 'my-clean-collection';

const client = new CosmosClient({ endpoint, key });

const container = client.database(databaseId).container(containerId);

const getLatestDocument = async () => {
  const querySpec = {
    query: 'SELECT TOP 1 * FROM c ORDER BY c._ts DESC'
  };

  try {
    const { resources: documents } = await container.items.query(querySpec).fetchAll();
    return documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

const startServer = async () => {
  const http = require('http');
  const fs = require('fs').promises;
  
  const port = 3000;
  
  const server = http.createServer(async (req, res) => {
    try {
      const latestDocument = await getLatestDocument();
      const html = await fs.readFile('./index.html', 'utf8');
      const renderedHtml = html.replace(/\$\{latestDocument\.(.+?)\}/g, (_, key) => {
        if (key === 'body') {
          return JSON.stringify(latestDocument[key]);
        } else {
          return latestDocument[key];
        }
      });
    
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(renderedHtml);
    } catch (error) {
      console.log(error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  });
  
  server.listen(port, () => {
    console.log(`Server listening on port ${port},  http://localhost:${port}`);
  });
};

startServer();
