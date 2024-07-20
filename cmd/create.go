/*
Copyright © 2024 Cranom Techonologies info@cranom.com
*/
package cmd

import (
	"fmt"

	"github.com/cranom/cli/utils/container"
	"github.com/spf13/cobra"
)

func Create(cmd *cobra.Command, args []string) {
	fmt.Println("Create a new resource on Cranom Platform")

	// Create a new container
	containerID, err := container.CreateContainer("nginx:latest", "my-nginx", []string{}, map[string]struct{}{}, map[uint16]uint16{8080: 80}, "")
}
