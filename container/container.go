package container

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/client"
	"github.com/docker/go-connections/nat"
)

// CreateContainer creates a new container
func CreateContainer(dockerImage string, name string, env []string, volumes map[string]struct{}, ports map[uint16]uint16, networkName string) (string, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return "", fmt.Errorf("failed to create Docker client: %w", err)
	}

	ctx := context.Background()

	// Pull the image if it does not exist
	_, err = cli.ImagePull(ctx, dockerImage, image.PullOptions{})
	if err != nil {
		return "", fmt.Errorf("failed to pull image %s: %w", dockerImage, err)
	}

	// Configure container ports
	exposedPorts := nat.PortSet{}
	portBindings := nat.PortMap{}
	for hostPort, containerPort := range ports {
		port := nat.Port(fmt.Sprintf("%d/tcp", containerPort))
		exposedPorts[port] = struct{}{}
		portBindings[port] = []nat.PortBinding{
			{
				HostPort: fmt.Sprintf("%d", hostPort),
			},
		}
	}

	// Create the container
	resp, err := cli.ContainerCreate(
		ctx,
		&container.Config{
			Image:        dockerImage,
			Env:          env,
			ExposedPorts: exposedPorts,
		},
		&container.HostConfig{
			Binds:        createVolumeBindings(volumes),
			PortBindings: portBindings,
		},
		&network.NetworkingConfig{},
		nil,
		name,
	)
	if err != nil {
		return "", fmt.Errorf("failed to create container: %w", err)
	}

	if networkName != "" {
		err = cli.NetworkConnect(ctx, networkName, resp.ID, nil)
		if err != nil {
			return "", fmt.Errorf("failed to connect container to network %s: %w", networkName, err)
		}
	}

	// Start the container
	if err := cli.ContainerStart(ctx, resp.ID, container.StartOptions{}); err != nil {
		return "", fmt.Errorf("failed to start container: %w", err)
	}

	return resp.ID, nil
}

// createVolumeBindings converts the volumes map to the format expected by Docker
func createVolumeBindings(volumes map[string]struct{}) []string {
	var bindings []string
	for volume := range volumes {
		bindings = append(bindings, volume)
	}
	return bindings
}
