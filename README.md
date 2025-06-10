# Satellite

_Satellite helps you launch your projects and ideas into orbit,_<br/>
_organizing them visually with constellations and detailed missions._

<img src="app/public/satellite.svg" width="120" height="120">

## Table of Contents

-   [Satellite](#satellite)
    -   [Table of Contents](#table-of-contents)
    -   [Getting Started](#getting-started)
        -   [Prerequisites](#prerequisites)
        -   [Installation](#installation)
    -   [Usage](#usage)
    -   [Development](#development)
    -   [License](#license)

## Getting Started

### Prerequisites

Before installing _Satellite_, make sure Git, Docker, Docker Compose and Bun are installed on your system.

### Installation

```sh
git clone https://github.com/wz73/satellite
```

## Usage

Start containers with docker compose:

```sh
./scripts/dco_up.sh
```

Stop containers with docker compose:

```sh
./scripts/dco_down.sh
```

## Development

Run Postgres database container:

```sh
docker-compose up satellite_db
```

Run app in development mode:

```sh
cd app
bun run dev
```

Access live-server at _http://localhost:3000/_

## License

This project is licensed under the [MIT License](./LICENSE).
You are free to use, modify, and distribute this software, provided you retain the original copyright notice.
See the [LICENSE](./LICENSE) file for more details.
