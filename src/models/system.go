package models

type ProcessorInfo struct {
	Name       string `json:"name"`
	CoreCount  string `json:"coreCount"`
	ClockSpeed string `json:"clockSpeed"`
	BitDepth   string `json:"bitDepth"`
}

type MachineInfo struct {
	OperatingSystem     string `json:"operatingSystem"`
	TotalRam            string `json:"totalRam"`
	RamTypeOrOSBitDepth string `json:"ramTypeOrOSBitDepth"`
	ProcCount           string `json:"procCount"`
}

type StorageInfo struct {
	MainStorage string `json:"mainStorage"`
	Total       string `json:"total"`
	DiskCount   string `json:"diskCount"`
	SwapAmount  string `json:"swapAmount"`
}

type SystemInfo struct {
	Processor ProcessorInfo `json:"processor"`
	Machine   MachineInfo   `json:"machine"`
	Storage   StorageInfo   `json:"storage"`
}

type SystemUsage struct {
	Processor int `json:"processor"`
	RAM       int `json:"ram"`
	Storage   int `json:"storage"`
}

type Uptime struct {
	Days    string `json:"days"`
	Hours   string `json:"hours"`
	Minutes string `json:"minutes"`
	Seconds string `json:"seconds"`
}

type AllInfo struct {
	Usage      SystemUsage `json:"usage"`
	Uptime     Uptime      `json:"uptime"`
	SystemInfo SystemInfo  `json:"systemInfo"`
}
