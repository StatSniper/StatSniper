package models

type ProcessorInfo struct {
	Name       string  `json:"name"`
	CoreCount  int     `json:"coreCount"`
	ClockSpeed float64 `json:"clockSpeed"`
	BitDepth   string  `json:"bitDepth"`
}

type MachineInfo struct {
	OperatingSystem string `json:"operatingSystem"`
	TotalRam        uint64 `json:"totalRam"`
	MemorySpeed     int    `json:"memorySpeed"`
	CoreCount       int    `json:"coreCount"`
	ProcessCount    int    `json:"processCount"`
	AvailableRam    uint64 `json:"availableRam"`
	Kernel          string `json:"kernel"`
}

type StorageInfo struct {
	MainStorage string `json:"mainStorage"`
	Total       uint64 `json:"total"`
	DiskCount   int    `json:"diskCount"`
	SwapAmount  uint64 `json:"swapAmount"`
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
