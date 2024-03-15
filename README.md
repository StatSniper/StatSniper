# StatSniper

StatSniper is an open-source project aimed at providing a comprehensive dashboard for monitoring various system utilizations such as memory, CPU, processor type, core count, clock speed, free power, total memory, free memory, processes, storage, and more. This tool is ideal for server owners or individual computer users who wish to keep an eye on their infrastructure's performance by deploying a single Docker container.


<div align="center"><img src="https://github.com/StatSniper/StatSniper/raw/beta/assets/logo.png" width="400"></div>


## Features

- Monitor CPU, memory, and storage utilization in real-time.
- Detailed system information including processor type, core count, clock speed, and bit depth.
- Cross-platform support with Docker images for both Linux and Windows systems.
- Easy deployment with Docker.
- Interactive web dashboard for a clear visualization of system metrics.

## Screenshots

<div align="center"><img src="https://github.com/StatSniper/StatSniper/raw/beta/assets/screenshot1.png" width="400"></div>

## Production Demos

- [Demo 1 (linux-latest)](https://ss.ulgen.dublok.com/)
- [Demo 2 (linux-latest)](https://ss.trinity.dublok.com/)
- [Demo 3 (linux-latest)](https://ss.hades.dublok.com/)

## Installation

Ensure you have Docker installed on your system. Then, pull the Docker image from Docker Hub:

Linux:

```bash
docker pull dublok/statsniper:linux-latest
```

Windows:

```bash
docker pull dublok/statsniper:windows-latest
```

## Docker Image Release Channels

StatSniper offers a range of Docker images tailored to different stages of development and deployment, ensuring that users can select the version that best fits their needs. Our images are hosted on Docker Hub and are divided into three main release channels: Alpha, Beta, and Stable. Below is a summary of each:

### Alpha
The Alpha channel is designed for development purposes, offering the latest builds directly from our main development branch. These images are best suited for development and testing, as they include the most recent changes and features. However, they may also be less stable.

**Tags:**
- `windows-alpha`, `linux-alpha` for the latest alpha build.
- `linux-alpha-{git-hash}`, `windows-alpha-{git-hash}` for specific commits, providing traceability to a specific state of development.

### Beta
Beta releases are more stable than alpha builds and undergo more rigorous testing. They are suitable for users who want early access to upcoming features with a higher degree of stability.

**Tags:**
- `windows-beta`, `linux-beta` for the latest beta build.
- `linux-beta-{git-hash}`, `windows-beta-{git-hash}` for builds pegged to specific commits, offering a balance between new features and stability.

### Releases (Stable)
Stable releases are thoroughly tested and recommended for production use. They represent the most reliable version of StatSniper at any given time.

**Tags:**
- `windows-latest`, `linux-latest` for the most current stable release.
- Version-specific tags (e.g., `windows-v0.1-beta.1`, `linux-v0.1-beta.1`) allow users to lock in a specific version for maximum consistency and reliability in production environments.

To view all available tags and select the appropriate version for your needs, visit our [Docker Hub page](https://hub.docker.com/r/dublok/statsniper/tags).

---

Incorporating this section into your README.md offers a clear and detailed guide for users to understand the purpose and stability level of each Docker image channel, helping them make informed decisions based on their specific requirements.


## Usage

To run StatSniper:

On Linux:

```bash
docker run -d -p 80:80 dublok/statsniper:linux-latest
```

On Windows:

```bash
docker run -d -p 80:80 dublok/statsniper:windows-latest
```

This command will start the StatSniper dashboard and make it accessible via `http://localhost`.

## Building from Source

Clone the repository from GitHub:

```bash
git clone https://github.com/StatSniper/StatSniper.git
cd StatSniper
```

Build the Docker image:

```bash
docker build -t yourtag/statsniper .
```

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcomed.

## Links

- Project homepage: [https://github.com/StatSniper/StatSniper](https://github.com/StatSniper/StatSniper)
- Docker Hub: [https://hub.docker.com/r/dublok/statsniper](https://hub.docker.com/r/dublok/statsniper)
- Issue tracker: [https://github.com/StatSniper/StatSniper/issues](https://github.com/StatSniper/StatSniper/issues)

## Licensing

The code in this project is licensed under MIT license.
