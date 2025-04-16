const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 8000;

app.use(cors());

const doUrl = "https://stellarium.sfo2.cdn.digitaloceanspaces.com/";

const dataSources = {
  stars: {
    minimal:
      "swe-data-packs/minimal/2020-03-11/minimal_2020-03-11_46fa7ea9/stars",
    base: "swe-data-packs/base/2020-03-11/base_2020-03-11_5fb747de/stars",
    extended:
      "swe-data-packs/extended/2020-03-11/extended_2020-03-11_26aa5ab8/stars",
    gaia: "surveys/gaia/v1",
  },
  skycultures: {
    western: "skycultures/v3/western",
  },
  dss: {
    default: "surveys/dss/v1",
  },
  milkyway: {
    default: "surveys/milkyway/v1",
  },
  dsos: {
    base: "swe-data-packs/base/2020-03-11/base_2020-03-11_5fb747de/dso",
    extended:
      "swe-data-packs/extended/2020-03-11/extended_2020-03-11_26aa5ab8/dso",
  },
};

app.get(/\/data\/([^\/]+)\/([^\/]+)\/(.*)/, async (req, res) => {
  const category = req.params[0];
  const key = req.params[1];
  const filepath = req.params[2];

  const basePath = dataSources[category]?.[key];
  if (!basePath)
    return res.status(404).json({ error: "Data source not found." });

  const fullPath = `${doUrl}${basePath}/${filepath || ""}`;

  try {
    const response = await fetch(fullPath);
    if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const buffer = await response.arrayBuffer(); // Native fetch uses arrayBuffer()

    res.set("Content-Type", contentType);
    res.send(Buffer.from(buffer)); // Convert to Node.js Buffer
  } catch (error) {
    console.error(`Error fetching ${fullPath}`, error);
    res.status(500).json({ error: "Failed to fetch data source file." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend proxy running at http://localhost:${PORT}`);
});
