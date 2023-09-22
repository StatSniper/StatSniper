package systemInfo

import (
	"StatSniper/models"
	"fmt"

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

	// Create and return SystemInfo object
	return models.SystemInfo{
		Processor: models.ProcessorInfo{
			Name:       cpuInfo[0].ModelName,
			CoreCount:  totalCores,
			ClockSpeed: fmt.Sprintf("%.2f GHz", float64(cpuInfo[0].Mhz)/1000),
			BitDepth:   GetBitDepth(hostInfo.KernelArch),
		},
		Machine: models.MachineInfo{
			OperatingSystem:     hostInfo.Platform,
			TotalRam:            memInfo.Total,
			AvailableRam:        memInfo.Available,
			RamTypeOrOSBitDepth: GetBitDepth(hostInfo.KernelArch),
			ProcCount:           totalCores,
		},
		Storage: models.StorageInfo{
			MainStorage: diskInfo.Path,
			Total:       diskInfo.Total,
			DiskCount:   diskCount,
			SwapAmount:  memInfo.SwapTotal,
		},
	}
}

func GetBitDepth(arch string) string {
	switch arch {
	case "amd64", "x86_64":
		return "64-bit"
	case "i386", "i686":
		return "32-bit"
	case "arm64", "aarch64":
		return "64-bit"
	default:
		return "Unknown bit depth"
	}
}
