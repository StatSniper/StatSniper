package systemUsage

import (
	"log"
	"sync"
	"time"

	"StatSniper/models"
	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/disk"
	"github.com/shirou/gopsutil/mem"
)

var cpuUsageHistory []float64
var historyMutex sync.Mutex

func init() {
	go func() {
		for {
			cpuPercents, err := cpu.Percent(time.Second/2, false)
			if err != nil {
				log.Printf("could not get CPU usage: %v", err)
			}

			if len(cpuPercents) > 0 {
				historyMutex.Lock()
				cpuUsageHistory = append(cpuUsageHistory, cpuPercents[0])
				if len(cpuUsageHistory) > 10 { // Keep only the last 5 samples (5 seconds at 1 sample per second)
					cpuUsageHistory = cpuUsageHistory[1:]
				}
				historyMutex.Unlock()
			}

			time.Sleep(time.Second / 2) // Sample every second
		}
	}()
}

func GetSystemUsage() models.SystemUsage {
	historyMutex.Lock()
	defer historyMutex.Unlock()

	var maxCPUUsage float64
	for _, usage := range cpuUsageHistory {
		if usage > maxCPUUsage {
			maxCPUUsage = usage
		}
	}

	memStat, err := mem.VirtualMemory()
	if err != nil {
		log.Printf("could not get memory usage: %v", err)
	}

	diskStat, err := disk.Usage("/")
	if err != nil {
		log.Printf("could not get disk usage: %v", err)
	}

	return models.SystemUsage{
		Processor: int(maxCPUUsage),
		RAM:       int(memStat.UsedPercent),
		Storage:   int(diskStat.UsedPercent),
	}
}
