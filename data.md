## Data Management

### Database Information

**Type**: JSON-based file system (No traditional database used)

**Structure**:

- **Sky Cultures**: Stored in `/data/sky-cultures/[culture-name].json`
- **Stars**: EPH format files in `/data/stars/`
- **Landscapes**: Image and metadata in `/data/landscapes/[name]/`
- **Surveys**: Astronomical survey images in `/data/surveys/`
- **Constellation Descriptions**: Stored in `/data/constellation_descriptions/[culture-name].json`
- **Star Data**: Centralized star information in `/data/star_data.json`
- **Planet Data**: Solar system objects in `/data/planet_data.json`

**Data Sources**:

- Indigenous sky culture data: Collected from Stellarium
- Star catalogs: Hipparcos and derived datasets
- Landscape images: Custom panoramic image
- Deep Sky Objects: Currently disabled due to licensing restrictions
- Constellation descriptions: Cultural narratives and astronomical information
- Star data: Compiled stellar properties and classifications
- Planet data: Solar system ephemeris and orbital parameters

**File Locations**:

```
/data/
├── sky-cultures/
│   ├── kamilaroi.json
│   ├── western.json
│   └── [other-cultures].json
├── constellation_descriptions.json
├── stars/
│   ├── base/
│   ├── minimal/
│   └── extended/
│   └── star_data.json
├── planets/
│   └── planet_data.json
├── landscapes/
└── surveys/
```

**Data File Descriptions**:

- **constellation_descriptions.json/**: Contains detailed descriptions, stories, and cultural significance for each constellation within specific sky cultures. Includes both Western astronomical descriptions and Indigenous cultural narratives with proper attribution and respect for traditional knowledge.

- **star_data.json**: Comprehensive stellar database including magnitudes, coordinates, spectral types, and cross-references to HIP catalog numbers. Contains photometric data (B, V, R, I magnitudes), proper motion data, parallax measurements, radial velocities, and stellar classifications for accurate positioning and rendering.

- **planet_data.json**: Solar system object data including orbital elements, physical properties, and ephemeris information for planets, moons, and other celestial bodies. Contains JPL Horizons orbital data, physical characteristics (radius, albedo), and Wikipedia descriptions for educational content. Includes both major planets and dwarf planets like Pluto.
