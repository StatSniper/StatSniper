//go:build windows
// +build windows

package uptime

import (
	"StatSniper/models"
	"fmt"
	"syscall"
	"time"
)

var (
	kernel32           = syscall.NewLazyDLL("kernel32.dll")
	getTickCount64Proc = kernel32.NewProc("GetTickCount64")
)

func GetSystemUptime() models.Uptime {
	var err error
	r1, _, err := getTickCount64Proc.Call()
	if err != nil && err.Error() != "The operation completed successfully." {
		panic(err)
	}

	uptimeMillis := uint64(r1)
	uptimeDuration := time.Duration(uptimeMillis) * time.Millisecond

	totalSeconds := int(uptimeDuration.Seconds())
	days := totalSeconds / (24 * 3600)
	totalSeconds = totalSeconds % (24 * 3600)
	hours := totalSeconds / 3600
	totalSeconds = totalSeconds % 3600
	minutes := totalSeconds / 60
	seconds := totalSeconds % 60

	return models.Uptime{
		Days:    fmt.Sprintf("%02d", days),
		Hours:   fmt.Sprintf("%02d", hours),
		Minutes: fmt.Sprintf("%02d", minutes),
		Seconds: fmt.Sprintf("%02d", seconds),
	}
}
