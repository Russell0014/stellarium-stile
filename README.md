<div align="center">
  <img src="public/stellarium.png" alt="Stellarium Logo" width="80" height="80">
  <h1>Stellarium Simulation</h1>
  <p>A React planetarium app that blends modern astronomy with traditional Indigenous star knowledge from the Kamilaroi and Euahlayi peoples of northern NSW. Users can explore the night sky through both Western and Kamilaroi perspectives, discovering constellations alongside scientific data in a clean, interactive interface.</p>
</div>

## Table of Contents

- [Installation](#installation)
- [Running Instructions](#running-instructions)
- [Indigenous Rights and Deployment](#indigenous-rights-and-deployment)
- [Project URLs](#project-urls)
- [Assets](#assets)

## Installation

### Prerequisites

- Node.js
- npm
- Modern web browser with WebGL support

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/Russell0014/stellarium-stile.git
   cd stellarium-stile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running Instructions

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Production Build

```bash
npm run build
npm run start
```

### Testing

```bash
npm test
```

## Indigenous Rights and Deployment

**Important Notice**: This project contains Indigenous cultural content and sky knowledge that requires respectful handling and appropriate permissions for public deployment.

## Assets

### 1. Deep Sky Objects (DSO)

Extended celestial objects including galaxies, nebulae, and star clusters. Currently disabled due to lack of available images - objects would display as placeholder blue circles.

### 2. Sky Cultures

Cultural astronomical knowledge systems, each with unique constellation definitions and storytelling. Example structure for Kamilaroi Sky Culture:

```json
{
	"id": "kamilaroi",
	"region": "Australasia",
	"constellations": [
		{
			"id": "CON kamilaroi Emu1",
			"lines": [[83163, 83163]],
			"image": {
				"file": "illustrations/Gawaargaynl.png",
				"anchors": [{ "pos": [407, 270], "hip": 83684 }]
			},
			"common_name": { "english": "Gawaargay", "native": "Gawaargay" }
		}
	]
}
```

Key fields include constellation lines (HIP star numbers), overlay images with anchor points, and native/English names.

### 3. Landscapes

Panoramic ground views generated using HIPSTER tool. Stored as WebP images under `public/skydata/landscapes/[name]/` directories.
Images can be made using the [HIPSTER tool](https://github.com/Russell0014/stellarium-hipster).

### 4. Stars

Star data in EPH format, loaded in three tiers based on visual magnitude:

- **Base**: Auto-loaded on startup
- **Minimal**: mag -1.09 to 7.0 (loaded on zoom)
- **Extended**: mag 8.0 to 11.5 (loaded on deeper zoom)

**Adding More Stars**: To include additional star data beyond the current magnitude limits, you'll need to scrape the data from the main Stellarium Web application.

### 5. Surveys

High-resolution images displayed when zooming into specific celestial objects.

## License and Cultural Acknowledgments

This project respects Indigenous intellectual property rights. All cultural content is used with appropriate permissions and acknowledgments.

This project builds upon the foundational work of the Stellarium community:

- **Stellarium Web Engine**: [https://github.com/Stellarium/stellarium-web-engine](https://github.com/Stellarium/stellarium-web-engine)
- **Stellarium Data**: [https://github.com/Stellarium/stellarium-data](https://github.com/Stellarium/stellarium-data)
- **Stellarium Sky Cultures**: [https://github.com/Stellarium/stellarium-skycultures](https://github.com/Stellarium/stellarium-skycultures)
