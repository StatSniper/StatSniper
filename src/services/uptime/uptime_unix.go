//go:build linux || darwin
// +build linux darwin

package uptime

import (
	"StatSniper/models"
	"fmt"
	"syscall"
	"time"
)

func GetSystemUptime() models.Uptime {
	sysinfo := &syscall.Sysinfo_t{}
	err := syscall.Sysinfo(sysinfo)
	if err != nil {
		fmt.Println("Error:", err)
		return models.Uptime{}
	}
	uptimeDuration := time.Duration(sysinfo.Uptime) * time.Second

	days := int(uptimeDuration.Hours()) / 24
	hours := int(uptimeDuration.Hours()) % 24
	minutes := int(uptimeDuration.Minutes()) % 60
	seconds := int(uptimeDuration.Seconds()) % 60

	return models.Uptime{
		Days:    fmt.Sprintf("%d", days),
		Hours:   fmt.Sprintf("%d", hours),
		Minutes: fmt.Sprintf("%d", minutes),
		Seconds: fmt.Sprintf("%d", seconds),
	}
}
