# [StatSniper: Hassle-Free Monitoring Tool](https://github.com/StatSniper/StatSniper)

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
- [Demo 2 (linux-beta)](https://ss.hades.dublok.com/)
- [Demo 1 (linux-alpha)](https://ss.umay.dublok.com/)


## Getting Started with StatSniper

### Prerequisites
Before you begin, ensure you have Docker installed on your system. Docker is required to pull and run the StatSniper images. You can download Docker from [https://www.docker.com/get-started](https://www.docker.com/get-started).

### Installation
StatSniper is available as a Docker container for both Linux and Windows systems. Follow these steps to pull the appropriate Docker image for your platform:

**For Linux:**
```bash
docker pull dublok/statsniper:linux-latest
```

**For Windows:**
```bash
docker pull dublok/statsniper:windows-latest
```

We provide different Docker image channels including Alpha, Beta, and Stable to suit various development and deployment needs. For more details on selecting the right version, see our [Docker Image Release Channels](#docker-image-release-channels) section.

### Running StatSniper

After pulling the Docker image, you can run StatSniper using the following commands:

**On Linux:**
```bash
docker run -d -p 80:80 dublok/statsniper:linux-latest
```

**On Windows:**
```bash
docker run -d -p 80:80 dublok/statsniper:windows-latest
```

These commands will start the StatSniper dashboard and make it accessible through your web browser at `http://localhost`.

### Building from Source

If you prefer to build StatSniper from source:

1. Clone the repository:
    ```bash
    git clone https://github.com/StatSniper/StatSniper.git
    cd StatSniper
    ```

2. Build the Docker image:
    ```bash
    docker build -t yourtag/statsniper .
    ```

3. Follow the running instructions above to start the dashboard.


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

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcomed.

## Links

- Project homepage: [https://github.com/StatSniper/StatSniper](https://github.com/StatSniper/StatSniper)
- Docker Hub: [https://hub.docker.com/r/dublok/statsniper](https://hub.docker.com/r/dublok/statsniper)
- Issue tracker: [https://github.com/StatSniper/StatSniper/issues](https://github.com/StatSniper/StatSniper/issues)

## Licensing

The code in this project is licensed under MIT license.
