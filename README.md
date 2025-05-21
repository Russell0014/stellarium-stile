# Stellarium Simulation

Table of Contents:

## Assets

1. Deep Sky Objects (DSO)

Deep Sky Objects are extended objects which are external to our solar system, and not point sources like stars. They include galaxies, planetary nebulae and star clusters. They may or may not have images associated with them - typically depicted with a Swirling Galaxy Logo. DSOs are stored in .eph files - we cannot find a source to reproduce them and Stellarium's are not publicly accessible (Author quoted licensing reasons).

For our project - DSOs are disabled due to lack of images. They will display a placeholder blue circle when the image is not present, and we don't want this.

2. Sky Cultures

Sky Cultures are each defined in their own way - some may contain more information than others and thus must be investigated separately. This is an example of a Kamilaroi Sky Culture.

```json
"id": "kamilaroi",
  "region": "Australasia",
  "classification": ["ethnographic"],
  "fallback_to_international_names": false,
  "constellations": [
    {
      "id": "CON kamilaroi Emu1",
      "lines": [[83163, 83163]],
      "image": {
        "file": "illustrations/Gawaargaynl.png",
        "size": [1024, 1024],
        "anchors": [
          { "pos": [407, 270], "hip": 83684 },
          { "pos": [362, 475], "hip": 88839 },
          { "pos": [907, 418], "hip": 62027 }
        ]
      },
      "visibility": { "months": [6, 3] },
      "common_name": { "english": "Gawaargay", "native": "Gawaargay" }
    },
```

Explanation:

id: This will be the ID for the overarching Sky Culture (Eastern/Western/Kamilaroi etc.)
region: Conflicting Information on this
[Optional] thumbnail: Image to display when showing description for this sky culture.
fallback_to_iternational_names: Define to true if international names must be used as a fallback when no cultural name is explicity defined
langs_use_native_names: An Array List of languages which will use the native name by default
[Optional] native_lang: Language used for Native Names
constellations: List of Constellations in ID
id: Unique ID - Must start with "CON id ..." where id = ID of Sky Culture
lines: List of lines paths. Each number is a HIP (Hipparcos) Star Number
image: Image used as image overlay in the sky
file: Location
size: Size of Image - doesn't need to match actual size as is only used as a reference
anchors: Unsure
thumbnail:
visibility: Array List: Start of Visibility + End of Visibility
common_name: Array List: Can define Common and English Names
iau: International Astronomical Union name - Only used in Western Sky Culture

3. Landscapes

Landscapes can be generated through the HIPSTER tool \*Unimplemented, update file path when tool is added.

The tool requires a Panorama Photo and are stored under landscapes/[name]/. Which contains the webp images and the description. For a current implementation, click here.

4. Stars

Stars are stored as EPH Files, which we have no current way of generating the full dataset in this format. The latest tool that we've found to generate these EPH files are found on this branch: bfd64baeabc6650bd33a1c170a392b9a5163fcb1 on the Official Stellarium Web Engine repository, included under the tools folder.

The stars are loaded under 3 categories: base, minimal and extended. These are defined through the amount of stars that are present in each dataset and the view field which it's defined.

The base star dataset is automatically loaded in on boot, and thus no FOV is defined. The minimal and extended star datasets are incrementally loaded in on zoom

minimal :min_vmag = -1.0859375, max_vmag = 7.0
extended: min_vmag = 8.000020980834961, max_vmag = 11.5

5. Surveys

Surveys are images that're displayed when the user zooms into an object.

##

##
