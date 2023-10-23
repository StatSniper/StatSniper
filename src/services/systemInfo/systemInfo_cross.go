package systemInfo

import (
	"StatSniper/models"
	"bytes"
	"fmt"
	"os/exec"
	"runtime"
	"strconv"
	"strings"

	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/disk"
	"github.com/shirou/gopsutil/host"
	"github.com/shirou/gopsutil/mem"
)

func GetSystemInfo() models.SystemInfo {
	// Get CPU info
	cpuInfo, err := cpu.Info()
	if err != nil {
		return models.SystemInfo{}
	}

	// Get Host info
	hostInfo, err := host.Info()
	if err != nil {
		return models.SystemInfo{}
	}

	// Get Memory info
	memInfo, err := mem.VirtualMemory()
	if err != nil {
		return models.SystemInfo{}
	}

	// Get Disk info
	diskInfo, err := disk.Usage("/")
	if err != nil {
		return models.SystemInfo{}
	}

	// Get list of disk partitions
	partitions, err := disk.Partitions(false)
	if err != nil {
		return models.SystemInfo{}
	}

	// Count the number of partitions
	diskCount := len(partitions)

	// Get the total number of logical cores (including virtual cores)
	totalCores, err := cpu.Counts(true)
	if err != nil {
		return models.SystemInfo{}
	}

	ramSpeed, err := GetRAMSpeed()
	if err != nil {
		fmt.Println("Error getting GetRAMSpeed:", err)
		return models.SystemInfo{}
	}

	processCount, err := GetProcessCount()
	if err != nil {
		fmt.Println("Error getting process count:", err)
		return models.SystemInfo{}
	}

	osInfo, err := GetOSInfo()
	if err != nil {
		fmt.Println("Error getting OS info:", err)
		return models.SystemInfo{}
	}

	kernelInfo, err := GetKernelVersion()
	if err != nil {
		fmt.Println("Error GetKernelVersion info:", err)
		return models.SystemInfo{}
	}

	// Create and return SystemInfo object
	return models.SystemInfo{
		Processor: models.ProcessorInfo{
			Name:       cpuInfo[0].ModelName,
			CoreCount:  totalCores,
			ClockSpeed: cpuInfo[0].Mhz,
			BitDepth:   GetBitDepth(hostInfo.KernelArch),
		},
		Machine: models.MachineInfo{
			OperatingSystem: osInfo,
			Kernel:          kernelInfo,
			TotalRam:        memInfo.Total,
			AvailableRam:    memInfo.Available,
			MemorySpeed:     ramSpeed,
			ProcessCount:    processCount,
		},
		Storage: models.StorageInfo{
			MainStorage: diskInfo.Path,
			Total:       diskInfo.Total,
			DiskCount:   diskCount,
			SwapAmount:  memInfo.SwapTotal,
		},
	}
}

func GetOSInfo() (string, error) {
	var cmd *exec.Cmd

	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("powershell", "-Command", "(Get-WmiObject -Query 'select * from Win32_OperatingSystem').Caption")
	case "linux":
		cmd = exec.Command("sh", "-c", "lsb_release -d | cut -f2")
	case "darwin":
		cmd = exec.Command("sh", "-c", "sw_vers -productName && sw_vers -productVersion")
	default:
		return "", fmt.Errorf("unsupported operating system: %s", runtime.GOOS)
	}

	var out bytes.Buffer
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		return "", fmt.Errorf("failed to execute command: %v", err)
	}

	output := out.String()
	info := strings.TrimSpace(output)

	return info, nil
}

func GetKernelVersion() (string, error) {
	var cmd *exec.Cmd

	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("powershell", "-Command", "(Get-WmiObject Win32_OperatingSystem).Version")
	case "linux", "darwin":
		cmd = exec.Command("sh", "-c", "uname -r")
	default:
		return "", fmt.Errorf("unsupported operating system: %s", runtime.GOOS)
	}

	var out bytes.Buffer
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		return "", fmt.Errorf("failed to execute command: %v", err)
	}

	output := out.String()
	version := strings.TrimSpace(output)

	return version, nil
}

func GetRAMSpeed() (int, error) {
	var cmd *exec.Cmd

	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("powershell", "-Command", "Get-WmiObject Win32_PhysicalMemory | Select-Object Speed | Format-Table -HideTableHeaders")
	case "linux":
		cmd = exec.Command("sh", "-c", "lshw -C memory | grep clock | awk '{print $2}' | sed 's/MHz//'")
	case "darwin":
		cmd = exec.Command("sh", "-c", "system_profiler SPMemoryDataType | grep 'Speed' | awk '{print $2}'")
	default:
		return 0, fmt.Errorf("unsupported operating system: %s", runtime.GOOS)
	}

	var out bytes.Buffer
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		return 0, fmt.Errorf("failed to execute command: %v", err)
	}

	output := out.String()
	lines := strings.Split(output, "\n")
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}
		speed, err := strconv.Atoi(line)
		if err != nil {
			return 0, fmt.Errorf("failed to convert RAM speed to int: %v", err)
		}
		return speed, nil // return the speed of the first RAM module
	}

	return 0, fmt.Errorf("no RAM speed found")
}

func GetProcessCount() (int, error) {
	var cmd *exec.Cmd

	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("powershell", "-Command", "Get-Process | Measure-Object | Select-Object -ExpandProperty Count")
	case "linux", "darwin":
		cmd = exec.Command("sh", "-c", "ps aux | wc -l")
	default:
		return 0, fmt.Errorf("unsupported operating system: %s", runtime.GOOS)
	}

	var out bytes.Buffer
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		return 0, fmt.Errorf("failed to execute command: %v", err)
	}

	output := out.String()
	countStr := strings.TrimSpace(output)
	count, err := strconv.Atoi(countStr)
	if err != nil {
		return 0, fmt.Errorf("failed to convert process count to int: %v", err)
	}

	return count, nil
}

func GetBitDepth(arch string) string {
	switch arch {
	case "amd64", "x86_64":
		return "64"
	case "i386", "i686":
		return "32"
	case "arm64", "aarch64":
		return "64"
	default:
		return "Unknown bit depth"
	}
}
