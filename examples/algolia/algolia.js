import algoliasearch from "algoliasearch";

const client = algoliasearch("applicationID", "adminApiKey");

export const addSearchObjects = (indexName, data) => {
  const index = client.initIndex(indexName);

  index.addObjects(data, (err, content) => {
    if (err) {
      console.error(err);
    }
  });
};
