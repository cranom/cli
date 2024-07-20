package utils

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/client"
)

// CreateNetwork creates a new Docker network with the specified options
func CreateNetwork(name string, driver string, options map[string]string) (string, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return "", fmt.Errorf("failed to create Docker client: %w", err)
	}

	ctx := context.Background()

	networkResponse, err := cli.NetworkCreate(ctx, name, types.NetworkCreate{
		Driver:     driver,
		Options:    options,
		Attachable: true, // Allows containers to connect to the network
	})
	if err != nil {
		return "", fmt.Errorf("failed to create network: %w", err)
	}

	return networkResponse.ID, nil
}

// ListNetworks lists all Docker networks with optional filters
func ListNetworks(filtersArgs filters.Args) ([]types.NetworkResource, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return nil, fmt.Errorf("failed to create Docker client: %w", err)
	}

	ctx := context.Background()

	networks, err := cli.NetworkList(ctx, network.ListOptions{
		Filters: filtersArgs,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to list networks: %w", err)
	}

	return networks, nil
}

// RemoveNetwork removes a Docker network by name
func RemoveNetwork(name string) error {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return fmt.Errorf("failed to create Docker client: %w", err)
	}

	ctx := context.Background()

	err = cli.NetworkRemove(ctx, name)
	if err != nil {
		return fmt.Errorf("failed to remove network: %w", err)
	}

	return nil
}
