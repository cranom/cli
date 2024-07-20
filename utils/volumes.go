package utils

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types/volume"
	"github.com/docker/docker/client"
)

// CreateVolume creates a new Docker volume with the specified name
func CreateVolume(name string) (string, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return "", fmt.Errorf("failed to create Docker client: %w", err)
	}

	ctx := context.Background()

	vol, err := cli.VolumeCreate(ctx, volume.CreateOptions{
		Name: name,
	})
	if err != nil {
		return "", fmt.Errorf("failed to create volume: %w", err)
	}

	return vol.Name, nil
}

// ListVolumes lists all Docker volumes with optional filters
func ListVolumes() ([]*volume.Volume, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return nil, fmt.Errorf("failed to create Docker client: %w", err)
	}

	ctx := context.Background()

	volumes, err := cli.VolumeList(ctx, volume.ListOptions{})
	if err != nil {
		return nil, fmt.Errorf("failed to list volumes: %w", err)
	}

	return volumes.Volumes, nil
}

// RemoveVolume removes a Docker volume by name
func RemoveVolume(name string, force bool) error {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return fmt.Errorf("failed to create Docker client: %w", err)
	}

	ctx := context.Background()

	err = cli.VolumeRemove(ctx, name, force)
	if err != nil {
		return fmt.Errorf("failed to remove volume: %w", err)
	}

	return nil
}
