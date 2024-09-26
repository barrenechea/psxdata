# PSXData

This project serves serialized data from the [PSX DataCenter](https://psxdatacenter.com) as static resources via Cloudflare Pages, providing fast CDN access across the globe.

## Overview

PSXData is a modernized version of the original [psxdata](https://github.com/ticky/psxdata) project by [ticky](https://github.com/ticky). While the original project focused on parsing and serializing data from PSX DataCenter, this version takes it a step further by hosting the parsed data on Cloudflare Pages for efficient global distribution.

## Features

- Parsed data from PSX DataCenter for PlayStation 1, PlayStation 2, and PSP
- Static resources hosted on Cloudflare Pages for fast, global access
- Monthly updates to ensure data freshness
- Cover images for games (when available)

## Usage

The data is accessible at [https://psxdata.barrenechea.cl](https://psxdata.barrenechea.cl). Each game's data is stored in an individual JSON file, organized by platform, region, and game ID.

The format for accessing a specific game's data is:

```
https://psxdata.barrenechea.cl/{Platform}/{Region}/{GameID}.json
```

Where:

- `{Platform}` is either `PS1`, `PS2`, or `PSP`
- `{Region}` is either `America`, `Europe`, or `Japan`
- `{GameID}` is the specific game ID (e.g., SLUS-00594)

For example, to access the data for the game "Crash Bandicoot" (SCUS-94900) on PlayStation 1 in the American region, you would use:

```
https://psxdata.barrenechea.cl/PS1/America/SCUS-94900.json
```

This will return a JSON file containing the game's information.

### Cover Images

Cover images are available for many games. To access a cover image, use the following URL format:

```
https://psxdata.barrenechea.cl/{Platform}/{Region}/cover/{GameID}.{extension}
```

Where:

- `{Platform}`, `{Region}`, and `{GameID}` are the same as above
- `{extension}` is the file extension of the cover image (typically jpg or png)

For example:

```
https://psxdata.barrenechea.cl/PS1/America/cover/SCUS-94900.jpg
```

Note: Not all games have cover images available. The presence of a cover image is indicated by the `cover` property in the game's JSON data.

## Data Format

Each JSON file contains an object with the following properties:

- `id`: Game ID(s)
- `title`: Game title
- `discs`: Number of discs
- `languages`: List of language codes
- `link`: URL to the PSX DataCenter entry (if available)
- `includes`: Additional content information (if applicable)
- `cover`: URL to the cover image (if available)
- `officialTitle`: Official game title (if available)
- `commonTitle`: Common title of the game (if available)
- `region`: Region information
- `genre`: Game genre or style
- `developer`: Game developer (if available)
- `publisher`: Game publisher (if available)
- `releaseDate`: Game release date (if available)
- `description`: Game description (if available)

Note: The actual content and availability of fields may vary depending on the specific game and the information available in the PSX DataCenter database.

## Contributing

Contributions are welcome! If you notice any discrepancies in the data or have suggestions for improvements, please open an issue or submit a pull request.

## License

The code in this repository is licensed under the GNU General Public License v3.0 (GPL-3.0). You can find a copy of the license in the LICENSE file.

Please note that the data itself is sourced from PSX DataCenter and may be subject to different terms. We kindly request that you credit [PSX DataCenter](https://psxdatacenter.com) if you use this data in your projects.
