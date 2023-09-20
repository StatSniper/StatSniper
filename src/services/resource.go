package services

import (
	"StatSniper/models"
	"StatSniper/services/systemInfo"
	"StatSniper/services/systemUsage"
	"StatSniper/services/uptime"
)

func GetSystemInfo() models.SystemInfo {
	return systemInfo.GetSystemInfo()
}

func GetSystemUsage() models.SystemUsage {
	return systemUsage.GetSystemUsage()
}

func GetSystemUptime() models.Uptime {
	return uptime.GetSystemUptime()
}

func GetAllInfo() models.AllInfo {
	return models.AllInfo{
		Usage:      GetSystemUsage(),
		Uptime:     GetSystemUptime(),
		SystemInfo: GetSystemInfo(),
	}
}
