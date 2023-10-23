"use strict";

window.StatSniper = {
    currentPage: 1,
    html: null, background: null, processorLabelsArray: null, storageLabelsArray: null, processorTriangle: null, memorySpeed: null, storageTriangle: null, chart: null,
    ramLabelsArray: null, logoPage: null, contactsPage: null, currentClockSpeed: null, currentMemory: null, currentMachineBitDepth: null, currentCPUBitDepth: null, currentDiskSwap: null,
    currentCpuName: null, currentOsName: null, currentTotalStorage: null, currentCpuCoreCount: null, kernel: null, processCount: null, availableRam: null, currentDiskCount: null, firstControl: null, secondControl: null, cloudLeft: null, cloudRight: null, days: null, hours: null, minutes: null, seconds: null,
    _xhr: null,
    XHR: function(){
        if (!this._xhr) this._xhr = new XMLHttpRequest();
        return this._xhr;
    },
    Initialization: function () {
        this.GlobalsInitialization();
        this.BackgroundInitialization();
        this.LabelsInitialization();
        this.ChartInitialization();
        this.InitializeDOMElements();
        this.ShowCards();
        this.SendAllInfoRequest();
        this.AttachEventListeners();
    },
    InitializeDOMElements: function () {
        this.logoPage = document.getElementById("logo-page");
        this.contactsPage = document.getElementById("contacts-page");
        this.currentClockSpeed = document.getElementById("currentClockSpeed");
        this.currentMemory = document.getElementById("currentMemory");
        this.memorySpeed = document.getElementById("memorySpeed");
        this.currentCPUBitDepth = document.getElementById("currentCPUBitDepth");
        this.currentTotalStorage = document.getElementById("currentTotalStorage");
        this.currentDiskSwap = document.getElementById("currentDiskSwap");
        this.freeClockSpeed = document.getElementById("freeClockSpeed");
        this.processCount = document.getElementById("processCount");
        this.currentDiskCount = document.getElementById("currentDiskCount");
        this.currentCpuCoreCount = document.getElementById("currentCpuCoreCount");
        this.currentCpuName = document.getElementById("currentCpuName");
        this.availableRam = document.getElementById("availableRam");
        this.currentOsName = document.getElementById("currentOsName");
        this.kernel = document.getElementById("kernel");
        this.firstControl = document.getElementById("first-control");
        this.secondControl = document.getElementById("second-control");
        this.cloudLeft = document.getElementById("cloud-left");
        this.cloudRight = document.getElementById("cloud-right");
        this.days = document.getElementById("uptime-days");
        this.hours = document.getElementById("uptime-hours");
        this.minutes = document.getElementById("uptime-minutes");
        this.seconds = document.getElementById("uptime-seconds");
    },
    AttachEventListeners: function(){
        this.firstControl.addEventListener("click", event => this.ChangePage(event.target || event.srcElement));
        this.secondControl.addEventListener("click", event => this.ChangePage(event.target || event.srcElement));
    },
    ShowCards: function () {
        this.contactsPage.style.visibility = "hidden";
        const cards = document.getElementsByClassName("card");
        const versionLabel = document.getElementById("project-version");
        const randomSequenceArray = this.GetRandomSequenceArray();

        randomSequenceArray.forEach((randomIndex, i) => {
            setTimeout(() => {
                cards[randomIndex].style.opacity = "1";
                if (randomIndex === 4) versionLabel.style.opacity = "1";
            }, 70 * i);
        });
    },
    GetRandomSequenceArray: function () {
        const buffer = [];
        while (buffer.length < 5) {
            const randomNumber = Math.floor(Math.random() * 5);
            if (!buffer.includes(randomNumber)) {
                buffer.push(randomNumber);
            }
        }
        return buffer;
    },
    AjaxRequest: function (xhr, method, url, onSuccess) {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                const response = JSON.parse(this.responseText);
                onSuccess(response);
            }
        }
        xhr.open(method, url);
        xhr.send();
    },
    SendAllInfoRequest: function () {
        window.StatSniper.AjaxRequest(window.StatSniper.XHR(), "GET", "/api/all", response => {
            window.StatSniper.LabelsTick(response.usage);
            window.StatSniper.ChartTick(response.usage);
            window.StatSniper.UpdateInfo(response);
            window.StatSniper.UpdateUptime(response.uptime);

            setTimeout(window.StatSniper.SendAllInfoRequest, 1000);
        });
    },
    UpdateInfo: function (response) {
        this.currentClockSpeed.innerHTML = this.FormatFrequencyMHz(response.systemInfo.processor.clockSpeed);        
        this.freeClockSpeed.innerHTML = this.FormatFrequencyMHz(response.systemInfo.processor.clockSpeed * response.systemInfo.processor.coreCount, 0) + "/" + this.FormatFrequencyMHz((response.systemInfo.processor.clockSpeed * response.systemInfo.processor.coreCount) - (response.usage.processor / 100) * (response.systemInfo.processor.clockSpeed * response.systemInfo.processor.coreCount), 0);
        this.currentMemory.innerHTML = this.FormatBytes(response.systemInfo.machine.totalRam, 0);
        this.memorySpeed.innerHTML = this.FormatFrequencyMHz(response.systemInfo.machine.memorySpeed);
        this.currentCPUBitDepth.innerHTML = response.systemInfo.processor.bitDepth;
        this.currentTotalStorage.innerHTML = this.FormatBytes(response.systemInfo.storage.total);
        this.currentCpuCoreCount.innerHTML = response.systemInfo.processor.coreCount;
        this.currentDiskSwap.innerHTML = this.FormatBytes(response.systemInfo.storage.swapAmount);
        this.availableRam.innerHTML = this.FormatBytes(response.systemInfo.machine.availableRam, 0);
        this.processCount.innerHTML = response.systemInfo.machine.processCount;
        this.currentDiskCount.innerHTML = response.systemInfo.storage.diskCount;
        this.currentCpuName.innerHTML = response.systemInfo.processor.name;
        this.kernel.innerHTML = response.systemInfo.machine.kernel;
        this.currentOsName.innerHTML = response.systemInfo.machine.operatingSystem;
    },
    UpdateUptime: function (response) {
        this.days.innerHTML = response.days;
        this.hours.innerHTML = response.hours;
        this.minutes.innerHTML = response.minutes;
        this.seconds.innerHTML = response.seconds;
    },
    ChangePage: function (element) {
        const isControlCondition = [
            element.id === "first-control" && this.currentPage > 1,
            element.id === "second-control" && this.currentPage < 2
        ];
        if (isControlCondition.includes(true)) {
            this.currentPage += element.id === "first-control" ? -1 : 1;
            this.ApplyPageChangeEffects(this.currentPage);
        }
    },
    ApplyPageChangeEffects: function (newPage) {
        this.SetCloudAnimation(newPage);
        this.SetPageVisibility(newPage);
        this.SetControlOpacity(newPage);
    },
    SetPageVisibility: function (newPage) {
        const visibility = ["", "hidden"];
        this.logoPage.style.visibility = newPage === 1 ? visibility[0] : visibility[1];
        this.contactsPage.style.visibility = newPage === 1 ? visibility[1] : visibility[0];
    },
    SetCloudAnimation: function (newPage) {
        const animations = [
            ["fade-in-cloud-left", "fade-in-cloud-right"],
            ["fade-out-cloud-left", "fade-out-cloud-right"]
        ];
        this.cloudLeft.style.animation = animations[newPage - 1][0] + " 0.3s forwards";
        this.cloudRight.style.animation = animations[newPage - 1][1] + " 0.3s forwards";
    },
    SetControlOpacity: function (newPage) {
        const opacities = [0.5, 1];
        this.firstControl.style.opacity = newPage === 1 ? opacities[0] : opacities[1];
        this.secondControl.style.opacity = newPage === 1 ? opacities[1] : opacities[0];
    },
    BackgroundInitialization: function () {
        this.background = VANTA.FOG({el: "#background", blurFactor: 0.40, zoom: 1.50});

        if (this.html.getAttribute("theme") == "light")
        {
            this.background.setOptions
            ({
                highlightColor: 0xCAC7E8,
                midtoneColor: 0xBBB7ED,
                lowlightColor: 0xE4E3EF,
                baseColor: 0xE4E3EF
            });
        }
        else
        {
            this.background.setOptions
            ({
                highlightColor: 0x797979,
                midtoneColor: 0xFFFFFF,
                lowlightColor: 0xBCBCBC,
                baseColor: 0xBCBCBC
            });
        }
    },
    ChartInitialization: function () {
        let processorRectangle = document.getElementById("processor-rectangle");
        let ramRectangle = document.getElementById("ram-rectangle");
        let storageRectangle = document.getElementById("storage-rectangle");

        let ctx = document.getElementById("chart-body").getContext("2d");

        this.processorTriangle = document.getElementById("processor-triangle");
        this.ramTriangle = document.getElementById("ram-triangle");
        this.storageTriangle = document.getElementById("storage-triangle");

        let dataLight =
            {
                data:
                    {
                        labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                        datasets:
                            [
                                {
                                    borderWidth: 1.5,
                                    borderColor: "rgba(89, 101, 249, 1)",
                                    pointRadius: 2,
                                    pointHoverRadius: 3,
                                    pointBackgroundColor: "rgba(255, 255, 255, 1)",
                                    pointHoverBackgroundColor: "rgba(230, 232, 254, 1)",
                                    backgroundColor: "rgba(230, 232, 254, 0.3)",
                                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                                },
                                {
                                    borderWidth: 1.5,
                                    borderColor: "rgba(255, 89, 89, 1)",
                                    pointRadius: 2,
                                    pointHoverRadius: 3,
                                    pointBackgroundColor: "rgba(255, 255, 255, 1)",
                                    pointHoverBackgroundColor: "rgba(249, 226, 226, 1)",
                                    backgroundColor: "rgba(249, 226, 226, 0.3)",
                                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                                },
                                {
                                    borderWidth: 1.5,
                                    borderColor: "rgba(8, 193, 141, 1)",
                                    pointRadius: 2,
                                    pointHoverRadius: 3,
                                    pointBackgroundColor: "rgba(255, 255, 255, 1)",
                                    pointHoverBackgroundColor: "rgba(212, 242, 225, 1)",
                                    backgroundColor: "rgba(212, 242, 225, 0.3)",
                                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                                }
                            ]
                    }
            }
        let dataDark =
            {
                data:
                    {
                        labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                        datasets:
                            [
                                {
                                    borderWidth: 1.5,
                                    borderColor: "rgba(89, 101, 249, 1)",
                                    pointRadius: 2,
                                    pointHoverRadius: 3,
                                    pointBackgroundColor: "rgba(255, 255, 255, 1)",
                                    pointHoverBackgroundColor: "rgba(230, 232, 254, 1)",
                                    backgroundColor: "rgba(230, 232, 254, 0.3)",
                                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                                },
                                {
                                    borderWidth: 1.5,
                                    borderColor: "rgba(255, 89, 89, 1)",
                                    pointRadius: 2,
                                    pointHoverRadius: 3,
                                    pointBackgroundColor: "rgba(255, 255, 255, 1)",
                                    pointHoverBackgroundColor: "rgba(249, 226, 226, 1)",
                                    backgroundColor: "rgba(249, 226, 226, 0.3)",
                                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                                },
                                {
                                    borderWidth: 1.5,
                                    borderColor: "rgba(8, 193, 141, 1)",
                                    pointRadius: 2,
                                    pointHoverRadius: 3,
                                    pointBackgroundColor: "rgba(255, 255, 255, 1)",
                                    pointHoverBackgroundColor: "rgba(212, 242, 225, 1)",
                                    backgroundColor: "rgba(212, 242, 225, 0.3)",
                                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                                }
                            ]
                    }
            }
        let options =
            {
                type: "line",
                options:
                    {
                        maintainAspectRatio: false,
                        legend:
                            {
                                display: false
                            },
                        elements:
                            {
                                line:
                                    {
                                        tension: 0
                                    }
                            },
                        scales:
                            {
                                yAxes:
                                    [
                                        {
                                            ticks:
                                                {
                                                    display: false,
                                                    suggestedMin: 0,
                                                    suggestedMax: 100
                                                },
                                            gridLines:
                                                {
                                                    drawTicks: false
                                                }
                                        }
                                    ],
                                xAxes:
                                    [
                                        {
                                            ticks:
                                                {
                                                    display: false
                                                },
                                            gridLines:
                                                {
                                                    drawTicks: false
                                                }
                                        }
                                    ]
                            },
                        animation:
                            {
                                duration: 150
                            }
                    }
            };

        this.chart = new Chart(ctx, Object.assign((this.html.getAttribute("theme") == "light") ? dataLight : dataDark, options));

        processorRectangle.addEventListener("click", function(event) {window.StatSniper.HideDataset(event.target || event.srcElement)});
        ramRectangle.addEventListener("click", function(event) {window.StatSniper.HideDataset(event.target || event.srcElement)});
        storageRectangle.addEventListener("click", function(event) {window.StatSniper.HideDataset(event.target || event.srcElement)});
    },
    ChartTick: function (usageData) {
        let datasets = this.chart.data.datasets;

        for (let i = 0; i < datasets.length; i++)
        {
            let dataset = datasets[i].data;
            let usageDataArray = Object.values(usageData);

            for (let k = 0; k < dataset.length - 1; k++)
            {
                dataset[k] = dataset[k + 1];
            }
            dataset[dataset.length - 1] = usageDataArray[i];
        }

        this.chart.update();
    },
    HideDataset: function (element) {
        switch (String(element.id))
        {
            case "processor-rectangle":
            {
                this.processorTriangle.style.animation = (this.chart.getDatasetMeta(0).hidden) ? "fade-in-triangle 0.5s forwards" : "fade-out-triangle 0.5s forwards";

                this.chart.getDatasetMeta(0).hidden = (this.chart.getDatasetMeta(0).hidden) ? false : true;
                break;
            }
            case "ram-rectangle":
            {
                this.ramTriangle.style.animation = (this.chart.getDatasetMeta(1).hidden) ? "fade-in-triangle 0.5s forwards" : "fade-out-triangle 0.5s forwards";

                this.chart.getDatasetMeta(1).hidden = (this.chart.getDatasetMeta(1).hidden) ? false : true;
                break;
            }
            case "storage-rectangle":
            {
                this.storageTriangle.style.animation = (this.chart.getDatasetMeta(2).hidden) ? "fade-in-triangle 0.5s forwards" : "fade-out-triangle 0.5s forwards";

                this.chart.getDatasetMeta(2).hidden = (this.chart.getDatasetMeta(2).hidden) ? false : true;
                break;
            }
        }

        this.chart.update();
    },
    LabelsInitialization: function () {
        this.processorLabelsArray =
            [
                document.getElementById("processor-hundreds"),
                document.getElementById("processor-tens"),
                document.getElementById("processor-ones")
            ];
        this.ramLabelsArray =
            [
                document.getElementById("ram-hundreds"),
                document.getElementById("ram-tens"),
                document.getElementById("ram-ones")
            ];
        this.storageLabelsArray =
            [
                document.getElementById("storage-hundreds"),
                document.getElementById("storage-tens"),
                document.getElementById("storage-ones")
            ];
    },
    LabelsTick: function (usageData) {
        let usageDataArray = Object.values(usageData);

        for (let i = 0; i < usageDataArray.length; i++)
        {
            switch (i)
            {
                case 0:
                {
                    this.FormatLabels(this.processorLabelsArray, usageDataArray[i]);
                    break;
                }
                case 1:
                {
                    this.FormatLabels(this.ramLabelsArray, usageDataArray[i]);
                    break;
                }
                case 2:
                {
                    this.FormatLabels(this.storageLabelsArray, usageDataArray[i]);
                    break;
                }
            }
        }
    },
    FormatLabels : function (labelArray, usageData) {
        let usageDataString = String(usageData);

        switch (usageDataString.length)
        {
            case 1:
            {
                labelArray[0].innerHTML = 0;
                labelArray[0].style.color = (this.html.getAttribute("theme") == "light") ? "rgba(188, 188, 188, 1)" : "rgba(121, 121, 121, 1)";
                labelArray[1].innerHTML = 0;
                labelArray[1].style.color = (this.html.getAttribute("theme") == "light") ? "rgba(188, 188, 188, 1)" : "rgba(121, 121, 121, 1)";
                labelArray[2].innerHTML = usageDataString[0];
                labelArray[2].style.color = (this.html.getAttribute("theme") == "light") ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)";
                break;
            }
            case 2:
            {
                labelArray[0].innerHTML = 0;
                labelArray[0].style.color = (this.html.getAttribute("theme") == "light") ? "rgba(188, 188, 188, 1)" : "rgba(121, 121, 121, 1)";
                labelArray[1].innerHTML = usageDataString[0];
                labelArray[1].style.color = (this.html.getAttribute("theme") == "light") ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)";
                labelArray[2].innerHTML = usageDataString[1];
                labelArray[2].style.color = (this.html.getAttribute("theme") == "light") ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)";
                break;
            }
            default:
            {
                labelArray[0].innerHTML = usageDataString[0];
                labelArray[0].style.color = (this.html.getAttribute("theme") == "light") ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)";
                labelArray[1].innerHTML = usageDataString[1];
                labelArray[1].style.color = (this.html.getAttribute("theme") == "light") ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)";
                labelArray[2].innerHTML = usageDataString[2];
                labelArray[2].style.color = (this.html.getAttribute("theme") == "light") ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)";
            }
        }
    },
    GlobalsInitialization: function () {
        this.html = document.getElementById("html");
    },
    FormatBytes: function(bytes, decimals = 2){
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },
    FormatFrequencyMHz: function(mhz, decimals = 2) {
        if (mhz === 0) return '0 MHz';
    
        const k = 1000; // For frequency, we typically use powers of 10, not 2.
        const dm = decimals < 0 ? 0 : decimals;
        const units = ['MHz', 'GHz', 'THz', 'PHz', 'EHz', 'ZHz', 'YHz'];
    
        const i = Math.floor(Math.log(mhz) / Math.log(k));
    
        return parseFloat((mhz / Math.pow(k, i)).toFixed(dm)) + ' ' + units[i];
    }    
}