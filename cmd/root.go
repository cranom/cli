/*
Copyright © 2024 Cranom Techonologies info@cranom.com
*/
package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var cfgFile string

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "cranom",
	Short: "A CLI Client to interact with Cranom Platform Services",
	Long: `Cranom CLI is a CLI Client to interact with Cranom Platform Services.
	
	Learn More at: https://www.cranom.tech/plaform-tools/cli
	`,
	Version: "0.0.1",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Welcome to Cranom CLI")
		fmt.Println("Use cranom --help to see available commands")
	},
}

var loginCmd = &cobra.Command{
	Use:   "login",
	Short: "Login to Cranom Platform",
	Long: `Login to Cranom Platform using your Cranom Account.

	Example:
	cranom login --username <username> --token <token>
	`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Login to Cranom Platform")
	},
}

var logoutCmd = &cobra.Command{
	Use:   "logout",
	Short: "Logout from Cranom Platform",
	Long: `Logout from Cranom Platform using your Cranom Account.

	Example:
	cranom logout
	`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Logout from Cranom Platform")
	},
}

var createCmd = &cobra.Command{
	Use:   "create",
	Short: "Create a new resource on Cranom Platform",
	Long: `Create a new resource on Cranom Platform using your Cranom Account.

	Example:
	cranom create <software> --name <name> --version <version>
	`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Create a new resource on Cranom Platform")
	},
}

var listCmd = &cobra.Command{
	Use:   "list",
	Short: "List all resources on Cranom Platform",
	Long: `List all resources on Cranom Platform using your Cranom Account.

	Example:
	cranom list <software>
	`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("List all resources on Cranom Platform")
	},
}

var deleteCmd = &cobra.Command{
	Use:   "delete",
	Short: "Delete a resource on Cranom Platform",
	Long: `Delete a resource on Cranom Platform using your Cranom Account.

	Example:
	cranom delete <software> --name <name> --version <version>
	`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Delete a resource on Cranom Platform")
	},
}

var updateCmd = &cobra.Command{
	Use:   "update",
	Short: "Update a resource on Cranom Platform",
	Long: `Update a resource on Cranom Platform using your Cranom Account.

	Example:
	cranom update <software> --name <name> --version <version>
	`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Update a resource on Cranom Platform")
	},
}

var downloadCmd = &cobra.Command{
	Use:   "download",
	Short: "Download a resource from Cranom Platform",
	Long: `Download a resource from Cranom Platform using your Cranom Account.

	Example:
	cranom download <software> --name <name> --version <version>
	`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Download a resource from Cranom Platform")
	},
}

var stopCmd = &cobra.Command{
	Use:   "stop",
	Short: "Stop a resource on Cranom Platform",
	Long: `Stop a resource on Cranom Platform using your Cranom Account.

	Example:
	cranom stop <software> --name <name> --version <version>
	`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Stop a resource on Cranom Platform")
	},
}

var startCmd = &cobra.Command{
	Use:   "start",
	Short: "Start a resource on Cranom Platform",
	Long: `Start a resource on Cranom Platform using your Cranom Account.

	Example:
	cranom start <software> --name <name> --version <version>
	`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Start a resource on Cranom Platform")
	},
}

var statusCmd = &cobra.Command{
	Use:   "status",
	Short: "Get status of a resource on Cranom Platform",
	Long: `Get status of a resource on Cranom Platform using your Cranom Account.

	Example:
	cranom status <software> --name <name> --version <version>
	`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Get status of a resource on Cranom Platform")
	},
}

var runCmd = &cobra.Command{
	Use:   "run",
	Short: "Run a resource on Cranom Platform",
	Long: `Run a resource on Cranom Platform using your Cranom Account.

	Example:
	cranom run <software> --name <name> --version <version>
	`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Run a resource on Cranom Platform")
	},
}

var logsCmd = &cobra.Command{
	Use:   "logs",
	Short: "Get logs of a resource on Cranom Platform",
	Long: `Get logs of a resource on Cranom Platform using your Cranom Account.

	Example:
	cranom logs <software> --name <name> --version <version>
	`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Get logs of a resource on Cranom Platform")
	},
}

var deleteSoftwareCmd = &cobra.Command{
	Use:   "delete-software",
	Short: "Delete a software on Cranom Platform",
	Long: `Delete a software on Cranom Platform using your Cranom Account.

	Example:
	cranom delete-software <software>
	`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Delete a software on Cranom Platform")
	},
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}

func init() {
	cobra.OnInitialize(initConfig)

	rootCmd.AddCommand(loginCmd)
	rootCmd.AddCommand(logoutCmd)
	rootCmd.AddCommand(createCmd)
	rootCmd.AddCommand(listCmd)
	rootCmd.AddCommand(deleteCmd)
	rootCmd.AddCommand(updateCmd)
	rootCmd.AddCommand(downloadCmd)
	rootCmd.AddCommand(stopCmd)
	rootCmd.AddCommand(startCmd)
	rootCmd.AddCommand(statusCmd)
	rootCmd.AddCommand(runCmd)
	rootCmd.AddCommand(logsCmd)
	rootCmd.AddCommand(deleteSoftwareCmd)

	// Here you will define your flags and configuration settings.
	// Cobra supports persistent flags, which, if defined here,
	// will be global for your application.

	rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default is $HOME/.cranom.yaml)")

	// Cobra also supports local flags, which will only run
	// when this action is called directly.
	rootCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}

// initConfig reads in config file and ENV variables if set.
func initConfig() {
	if cfgFile != "" {
		// Use config file from the flag.
		viper.SetConfigFile(cfgFile)
	} else {
		// Find home directory.
		home, err := os.UserHomeDir()
		cobra.CheckErr(err)

		// Search config in home directory with name ".cli" (without extension).
		viper.AddConfigPath(home)
		viper.SetConfigType("yaml")
		viper.SetConfigName(".cranom")
	}

	viper.AutomaticEnv() // read in environment variables that match

	// If a config file is found, read it in.
	if err := viper.ReadInConfig(); err == nil {
		fmt.Fprintln(os.Stderr, "Using config file:", viper.ConfigFileUsed())
	}
}
