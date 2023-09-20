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
		Days:    days,
		Hours:   hours,
		Minutes: minutes,
		Seconds: seconds,
	}
}

func formatUptime(d time.Duration) string {
	days := int(d.Hours()) / 24
	hours := int(d.Hours()) % 24
	minutes := int(d.Minutes()) % 60
	seconds := int(d.Seconds()) % 60

	return fmt.Sprintf("%02d:%02d:%02d:%02d", days, hours, minutes, seconds)
}
