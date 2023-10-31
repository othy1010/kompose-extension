# VSCode Kompose Extension

This extension provides a seamless experience for transforming Docker Compose files into Kubernetes manifests directly within VSCode. With just a click, you can generate Kubernetes configurations without leaving your editor.

## Features

- **Transform Docker Compose to Kubernetes**: : Quickly and easily transform your Docker Compose files to Kubernetes manifests using the icon in a docker-compose file following the steps to generate them.

## Usage

1. Open a Docker Compose file (named `docker-compose.yml` or any variant).
2. Click on the icon in the editor title bar to trigger the `kompose.generate` command.

## Under the Hood

This extension leverages the power of the [Kompose](https://kompose.io/) transformation tool to convert Docker Compose files to Kubernetes manifests. Kompose is a widely recognized tool for this purpose, ensuring the output is accurate and optimal for Kubernetes deployments. Check it out for more insight about the transformation process.

## Extension Contributions

### Commands

- `kompose.generate`: Trigger a multi-step quick pick action to transform a file.

## Installation

1. Open VSCode.
2. Navigate to Extensions.
3. Search for "Kompose Extension".
4. Install and reload VSCode.

## Feedback and Contributions

If you have feedback or would like to contribute, please open an issue on GitHub.

---

### happy coding
