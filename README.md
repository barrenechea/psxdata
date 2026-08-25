# PSXData

This project serves serialized data from the [PSX DataCenter](https://psxdatacenter.com) as static resources via Cloudflare Pages, providing fast CDN access across the globe.

PlayStation 1 and PlayStation 2 are published as **separate Pages projects** (`ps1data` and `ps2data`) so each stays under the free-tier file limit.

## Overview

PSXData is a modernized version of the original [psxdata](https://github.com/ticky/psxdata) project by [ticky](https://github.com/ticky). While the original project focused on parsing and serializing data from PSX DataCenter, this version takes it a step further by hosting the parsed data on Cloudflare Pages for efficient global distribution.

## Features

- Parsed data from PSX DataCenter for PlayStation 1 and PlayStation 2
- Static resources hosted on Cloudflare Pages for fast, global access
- Monthly updates to ensure data freshness
- Cover images for games (when available)

## Usage

Each platform is its own site. Game files are organized by region and game ID (there is no platform segment in the path):

| Platform | Pages project | Site |
| --- | --- | --- |
| PlayStation 1 | `ps1data` | [https://ps1data.pages.dev](https://ps1data.pages.dev) |
| PlayStation 2 | `ps2data` | [https://ps2data.pages.dev](https://ps2data.pages.dev) |

```
https://{site}/{Region}/{GameID}.json
```

Where:

- `{site}` is `ps1data.pages.dev` or `ps2data.pages.dev`
- `{Region}` is `America`, `Europe`, or `Japan`
- `{GameID}` is the specific game ID (e.g. `SLUS-00594`)

For example, Crash Bandicoot (SCUS-94900) on PlayStation 1 in America:

```
https://ps1data.pages.dev/America/SCUS-94900.json
```

### Cover Images

Cover images are available for many games:

```
https://{site}/{Region}/covers/{GameID}.{extension}
```

`{extension}` is typically `jpg`. For example:

```
https://ps1data.pages.dev/America/covers/SCUS-94900.jpg
```

Not every game has a cover. Presence is indicated by the `cover` property in the game's JSON (that URL points at PSX DataCenter; the hosted file is under `covers/` as above).

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
