// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.756.1/runtimes/native1.12-tchmi/TcHmi.d.ts" />

/*
 * Generated 6/9/2022 11:43:30 AM
 * Copyright (C) 2022
 */
var TcHmi;
(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    let Controls;
    (function (/** @type {globalThis.TcHmi.Controls} */ Controls) {
        let framework_apex_trend;
        (function (framework_apex_trend) {
            class frameworkapextrendcontrol extends TcHmi.Controls.System.TcHmiControl {
                /*
                Attribute philosophy
                --------------------
                - Local variables are not set while definition in class, so they have the value 'undefined'.
                - On compile the Framework sets the value from HTML or from theme (possibly 'null') via normal setters.
                - The "changed detection" in the setter will result in processing the value only once while compile.
                - Attention: If we have a Server Binding on an Attribute the setter will be called once with null to initialize and later with the correct value.
                */
                /**
                 * Constructor of the control
                 * @param {JQuery} element Element from HTML (internal, do not use)
                 * @param {JQuery} pcElement precompiled Element (internal, do not use)
                 * @param {TcHmi.Controls.ControlAttributeList} attrs Attributes defined in HTML in a special format (internal, do not use)
                 * @returns {void}
                 */
                constructor(element, pcElement, attrs) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);

                    var __this = this;

                    // properties
                    this.__serverDomain = 'TcHmiSqliteHistorize';// needs get and set

                    this.__serverLiveDataRequests = [];

                    this.__internalLineGraphDescription = [];

                    this.__serverStartInMs = null;
                    this.__serverEndInMs = null;
                    this.__serverPeriodInMs = null;
                    this.__serverUserStartInMs = null;
                    this.__serverUserEndInMs = null;
                    this.__serverUserPeriodInMs = null;

                    this.__chartDatasetBySymbol = {};
                    this.__liveDataBySymbol = {};

                    this.__subscriptionId = null;


                    this.__lineGraphData = [];
                    this.__interval = 1000;
                    this.__maximumDatapoints = 1000;
                    this.__initialPeriod = 'PT1M';
                    this.__internalEnd = null;

                    this.__decimation = {
                        enabled: false,
                        algorithm: 'min-max',
                    };

                    this.__zoomOptions = {
                        limits: {
                            x: { min: 'original', max: 'original', minRange: 60 },
                        },
                        pan: {
                            enabled: true,
                            mode: 'x',
                            modifierKey: 'ctrl',
                        },
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            drag: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true
                            },
                            mode: 'x'
                        }
                    };

                    this.__data = {
                        datasets: []
                    };

                    this.__config = {
                        type: 'line',
                        data: this.__data,
                        options: {
                            // Turn off animations and data parsing for performance
                            animation: false,
                            parsing: false,

                            interaction: {
                                mode: 'nearest',
                                axis: 'x',
                                intersect: false
                            },
                            plugins: {
                                zoom: this.__zoomOptions,
                                decimation: this.__decimation,
                            },
                            scales: {
                                x: {
                                    parsing: false,
                                    type: 'time',
                                    ticks: {
                                        source: 'auto',
                                        // Disabled rotation for performance
                                        maxRotation: 0,
                                        autoSkip: true,
                                    }
                                },
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    };

                    // elements
                    this.__chartContainer = undefined

                    // things to destroy
                    this.__eventDestroyFunctions = [];

                }
                /**
                  * If raised, the control object exists in control cache and constructor of each inheritation level was called.
                  * Call attribute processor functions here to initialize default values!
                  */
                __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_framework_apex_trend_frameworkapextrendcontrol-Template');
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error('Invalid Template.html');
                    }

                    // elements
                    this.__chartContainer = this.__elementTemplateRoot.find('.chartContainer').get(0);


                    // Call __previnit of base class
                    super.__previnit();
                }
                /**
                 * Is called during control initialize phase after attribute setter have been called based on it's default or initial html dom values.
                 * @returns {void}
                 */
                __init() {

                    super.__init();

                }
                /**
                * Is called by tachcontrol() after the control instance gets part of the current DOM.
                * Is only allowed to be called from the framework itself!
                */
                __attach() {

                    super.__attach();
                    /**
                     * Initialize everything which is only available while the control is part of the active dom.
                     */

                    this.__setupChart();

                }
                /**
                * Is called by tachcontrol() after the control instance is no longer part of the current DOM.
                * Is only allowed to be called from the framework itself!
                */

                __detach() {

                    super.__detach();
                    /**
                     * Disable everything which is not needed while the control is not part of the active dom.
                     * No need to listen to events for example!
                     */

                    
                    if (null !== this.__subscriptionId) {
                        TcHmi.Server.unsubscribeEx(this.__subscriptionId, { parallel: !0, });
                    }

                    if (null !== this.__requestId) {
                        TcHmi.Server.releaseRequest(this.__requestId);
                    }

                    this.__subscriptionId = null;
                    this.__requestId = null;                   

                }
                /**
                * Destroy the current control instance.
                * Will be called automatically if system destroys control!
                */
                destroy() {

                    if (this.__chart)
                        this.__chart.destroy();
    
                    /**
                    * While __keepAlive is set to true control must not be destroyed.
                    */
                    if (this.__keepAlive) {
                        return;
                    }
                    super.destroy();
                    /**
                    * Free resources like child controls etc.
                    */
                }

                setLineDefinitionList(value) {

                    var convertedValue = TcHmi.ValueConverter.toObject(value);
                    if (tchmi_equal(convertedValue, this.__internalLineGraphDescription)) return;

                    this.__internalLineGraphDescription = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + ".onPropertyChanged", { propertyName: "LineDefinitionList" });
                    this.__processLineDefinitionListChange();

                }

                getLineDefinitionList() {

                    return this.__internalLineGraphDescription;

                }

                setInterval(value) {

                    var convertedValue = TcHmi.ValueConverter.toNumber(value);
                    if (tchmi_equal(convertedValue, this.__interval)) return;

                    this.__interval = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + ".onPropertyChanged", { propertyName: "Interval" });
                    this.__processIntervalChange();

                }

                getInterval() {

                    return this.__interval;

                }
           

                setInitialPeriod(value) {

                    let convertedValue = TcHmi.ValueConverter.toString(value);

                    if (null === convertedValue)
                        convertedValue = this.getAttributeDefaultValueInternal("InitialPeriod");

                    if (null !== convertedValue)
                        convertedValue = "first" === convertedValue.toLowerCase() ? "First" : convertedValue.toUpperCase();

                    if (convertedValue !== this.__initialPeriod) {

                        this.__initialPeriod = convertedValue;
                        TcHmi.EventProvider.raise(this.__id + ".onPropertyChanged", { propertyName: "InitialPeriod" });
                        this.__processInitialPeriodChange();

                    }

                }

                getInitialPeriod() {

                    return this.__initialPeriod;

                }


                __processLineDefinitionListChange() {

                    if (!this.__isChartAttached()) return;

                    if (this.__internalLineGraphDescription) {
                        this.__setupChart();
                    }

                }

                __processIntervalChange() {

                    if (!this.__isChartAttached()) return;

                    if (this.__interval)
                        this.__startChart();

                }

                __processInitialPeriodChange() {

                    if (!this.__isChartAttached()) return;

                    if (this.__initialPeriod)
                        this.__startChart();

                }

                __isChartAttached() {

                    return (this.__chart);

                }

                __convertLineGraphDescriptionsToDataset() {

                    const __this = this;

                    this.__internalLineGraphDescription.forEach(function (item) {

                        var dataset = {};

                        dataset.data = [];
                        dataset.label = item.legendName || '';
                        dataset.borderWidth = item.lineWidth;
                        dataset.pointRadius = item.pointDot ? item.pointDotRadius : 0;
                        dataset.pointBorderColor = item.pointDot ? item.pointDotStrokeColor.color : null;
                        dataset.pointBackgroundColor = item.pointDot ? item.pointDotFillColor.color : null;
                        dataset.borderColor = item.lineColor.color;

                        if (dataset.pointBorderColor == null)
                            delete dataset.pointBorderColor;

                        if (dataset.pointBackgroundColor == null)
                            delete dataset.pointBackgroundColor;
                         
                        __this.__chartDatasetBySymbol[item.symbol] = dataset;

                    })  
                }

                __disableChartCyclicUpdate() {

                    clearInterval(this.cyclic);

                }

                __setupChart() {

                    this.__disableChartCyclicUpdate();
                  
                    if (!this.__internalLineGraphDescription || this.__internalLineGraphDescription.length == 0) return;

                    this.__convertLineGraphDescriptionsToDataset();

                    if (!this.__chart) 
                        this.__chart = new Chart(this.__chartContainer, this.__config);
                                      
                    this.__chart.resetZoom('none');

                    this.__startChart();

                }

                __startChart() {
                    this.__unsubscribeAnyPreviousRequests();
                }

                __unsubscribeAnyPreviousRequests() {

                    if (TCHMI_DESIGNER) return;
                    if (!this.__isChartAttached()) return;

                    if (null !== this.__subscriptionId) {
                        TcHmi.Server.unsubscribeEx(this.__subscriptionId, { parallel: !0, });
                        (this.__subscriptionId = null);
                    }

                    if (null !== this.__requestId) {
                        TcHmi.Server.releaseRequest(this.__requestId);
                        this.__requestId = null;
                    }

                    if (null !== this.__updateDelay) {
                        clearTimeout(this.__updateDelay);
                    }

                    const callback = this._updateInternalLineGraphDescriptionWithServerConfiguration.bind(this);

                    const restTimeForServer = 100;
                    this.__updateDelay = setTimeout(function () {
                        this.__updateDelay = null;
                        callback();
                    }, restTimeForServer);

                }

                _updateInternalLineGraphDescriptionWithServerConfiguration() {

                    const __this = this;

                    var requestHistorizedSymbolList = {
                        "requestType": "ReadWrite",
                        "commands": [
                          {
                              "commandOptions": [
                                "SendErrorMessage",
                                "SendWriteValue"
                              ],
                              "symbol": this.__serverDomain + ".Config::historizedSymbolList"
                          }
                        ]
                    }
                    console.time('send config');
                    TcHmi.Server.requestEx(requestHistorizedSymbolList, { timeout: 5000 }, function (result) {
                        console.timeEnd('send config');
                        if (result.error === TcHmi.Errors.NONE && result.response) {

                            if (null !== result.response.error && void 0 !== result.response.error) {
                                console.log('Server error');
                                return;
                            }
                            
                            if (null !== result.response.commands[0].error && void 0 !== result.response.commands[0].error) {
                                console.log('response error');
                                console.log(result.response.commands[0].error);
                                return;
                            }

                            if (null == result.response.commands[0].readValue || void 0 == result.response.commands[0].readValue) {
                                return;
                            }

                            if (result.response.commands[0].symbol === __this.__serverDomain + ".Config::historizedSymbolList") {

                                let historizeSettings = result.response.commands[0].readValue;
                                let propertyNames = Object.keys(historizeSettings);

                                // if any of the property names are included in the symbol root then add the property details to the symbol

                                __this.__internalLineGraphDescription.forEach(function (item) {

                                    // check to see if any of the property names are in the symbol.
                                    propertyNames.forEach(function (propertyName) {

                                        if (item.symbol.startsWith(propertyName)) {

                                            // save out all of the historize settings in to the line description
                                            item.historizeSettings = {
                                                interval: historizeSettings[propertyName].interval,
                                                maxEntries: historizeSettings[propertyName].maxEntries,
                                                recordingEnabled: historizeSettings[propertyName].recordingEnabled,
                                                rowLimit: historizeSettings[propertyName].rowLimit,
                                                intervalInMs : __this.__isoToMilliSec(historizeSettings[propertyName].interval)
                                            };

                                        }
                                    })
                                });

                                __this.__getServerStartEndData();

                            }        
                        }
                    });
                }

                __getServerStartEndData() {               

                    if (this.__isAttached && this.__internalLineGraphDescription) {

                        let yAxis = [];

                        for (let i = 0, ii = this.__internalLineGraphDescription.length; i < ii; i++)
                            null !== this.__internalLineGraphDescription[i] && yAxis.push({ symbol: this.__internalLineGraphDescription[i].symbol, });

                        let request = {
                            requestType: "ReadWrite",
                            commands: [{
                                commandOptions: ["SendErrorMessage"],
                                symbol: this.__serverDomain + ".GetTrendLineWindow",
                                writeValue: {
                                    chartName: this.__id,
                                    xAxisStart: 'First',
                                    xAxisEnd: 'Latest',
                                    yAxes: yAxis,
                                    },

                                }, 
                                {
                                    commandOptions: ["SendErrorMessage"],
                                    symbol: this.__serverDomain + ".GetTrendLineWindow",
                                    writeValue: {
                                        chartName: this.__id,
                                        xAxisStart: this.__initialPeriod,
                                        xAxisEnd: 'Latest',
                                        yAxes: yAxis,
                                    }
                                }],
                        };

                        let __this = this;
                        console.time('send timespan');
                        this.__requestId = TcHmi.Server.request(
                            request,
                            function (result) {

                                console.timeEnd('send timespan');

                                __this.__serverStartInMs = new Date(result.response.commands[0].readValue.xAxisStart).getTime();
                                __this.__serverEndInMs = new Date(result.response.commands[0].readValue.xAxisEnd).getTime();
                                __this.__serverPeriodInMs = __this.__serverEndInMs - __this.__serverStartInMs;

                                __this.__serverUserStartInMs = new Date(result.response.commands[1].readValue.xAxisStart).getTime();
                                __this.__serverUserEndInMs = new Date(result.response.commands[1].readValue.xAxisEnd).getTime();
                                __this.__serverUserPeriodInMs = __this.__serverUserEndInMs - __this.__serverUserStartInMs;

                                __this.__clearInitialDataForAllSeries();

                            }
                        );
                    }
                }

                __clearInitialDataForAllSeries() {

                    this.__serverLiveDataRequests = [];
                    this.__liveDataBySymbol = {};

                    this._getLiveData();

                }

                _getLiveData() {

                    let __this = this;

                    let MAX_DATAPOINTS = this.__maximumDatapoints;

                    __this.__internalLineGraphDescription.forEach(function (line) {

                        __this.__liveDataBySymbol[line.symbol] = []

                        if (!__this.__serverPeriodInMs)
                            return;

                        let requestDetails = JSON.stringify({
                            symbol: line.symbol,
                            start: __this.__serverUserStartInMs,
                            end: __this.__serverUserEndInMs
                        });

                        let request = {
                            requestType: "ReadWrite",
                            commands: [{
                                commandOptions: ["SendErrorMessage"],
                                symbol: __this.__serverDomain + ".GetTrendLineData",
                                writeValue: {
                                    chartName: __this.__id,
                                    xAxisStart: new Date(__this.__serverUserStartInMs).toISOString(),
                                    xAxisEnd: new Date(__this.__serverUserEndInMs).toISOString(),
                                    yAxes: [{ symbol: line.symbol }],
                                    displayWidth: Math.round(MAX_DATAPOINTS),
                                },
                                customerData: requestDetails
                            }],
                        };

                        __this.__serverLiveDataRequests.push(request);

                    });


                    //let refreshInterval = 50;

                    //__this.cyclic = setInterval(function () {

                    //    __this.__chart.data.datasets = [];

                    //    Object.entries(__this.__liveDataBySymbol).map(item => {

                    //        var symbolName = item[0];
                    //        var currentData = item[1];

                    //        __this.__chartDatasetBySymbol[symbolName].data = currentData;

                    //        __this.__chart.data.datasets.push(__this.__chartDatasetBySymbol[symbolName]);

                    //    })

                    //    __this.__chart.update();

                    //}, refreshInterval);


                    let newDataReceivedCallback = __this.__getNewDataReceivedCallback();

                    let ProcessNextRequest = function () {

                        let request = __this.__serverLiveDataRequests.shift();


                        if (!request) {

                            __this.__chart.data.datasets = [];

                            Object.entries(__this.__liveDataBySymbol).map(item => {

                                var symbolName = item[0];
                                var currentData = item[1];

                                __this.__chartDatasetBySymbol[symbolName].data = currentData;

                                __this.__chart.data.datasets.push(__this.__chartDatasetBySymbol[symbolName]);

                            })

                            __this.__chart.update();

                            return;
                        }


                        console.time('processRequest');

                        __this.____serverRequestsId = TcHmi.Server.request(request, function (reply) { newDataReceivedCallback(reply); ProcessNextRequest(); });

                    }();

                }

                __getInitialCompressedDataForAllSeriesCopy() {

                    let __this = this;

                    let MAX_DATAPOINTS = this.__maximumDatapoints;

                    __this.__serverRequests = [];
                    __this.__liveDataBySymbol = {};

                    __this.__internalLineGraphDescription.forEach(function (line) {

                        __this.__liveDataBySymbol[line.symbol] = []

                        let intervalInMs = line.historizeSettings.intervalInMs;

                        let points = 1;

                        if (__this.__serverPeriodInMs)
                            points = __this.__serverPeriodInMs / intervalInMs;

                        let requests = points / MAX_DATAPOINTS;

                        console.log('total points - ', points);
                        console.log('max points per request - ', MAX_DATAPOINTS);

                        let yAxis = [{ symbol: line.symbol }];

                        let requestStart = __this.__serverStartInMs;
                        let requestEnd = __this.__serverStartInMs + (intervalInMs * MAX_DATAPOINTS);

                        console.log('Actual Start', new Date(requestStart).toISOString());
                        console.log('Actual End', new Date(requestEnd).toISOString());
                        console.log('Requests', requests);

                        let logRequests = [];


                        for (let i = 0; i < Math.ceil(requests) ; i++) {

                            requestEnd = Math.min(requestEnd, new Date(__this.__serverEndInMs).getTime())

                            var log = {
                                xAxisStart: new Date(requestStart).toISOString(),
                                xAxisEnd: new Date(requestEnd).toISOString(),
                                displayWidth: Math.ceil(MAX_DATAPOINTS + 1),
                            };

                            let requestDetails = JSON.stringify({
                                symbol: line.symbol,
                                start: requestStart,
                                end: requestEnd
                            });

                            let request = {
                                requestType: "ReadWrite",
                                commands: [{
                                    commandOptions: ["SendErrorMessage"],
                                    symbol: __this.__serverDomain + ".GetTrendLineData",
                                    writeValue: {
                                        chartName: __this.__id,
                                        xAxisStart: new Date(requestStart).toISOString(),
                                        xAxisEnd: new Date(requestEnd).toISOString(),
                                        yAxes: yAxis,
                                        displayWidth: Math.round(MAX_DATAPOINTS + 1),
                                    },
                                    customerData: requestDetails
                                }],
                            };

                            __this.__serverRequests.push(request);

                            requestStart = requestStart + (intervalInMs * MAX_DATAPOINTS);
                            requestEnd = requestEnd + (intervalInMs * MAX_DATAPOINTS);

                        }

                    });


                    let refreshInterval = (__this.__interval > 0) ? __this.__interval / 2 : 1000;

                    __this.cyclic = setInterval(function () {

                        __this.__chart.data.datasets = [];

                        Object.entries(__this.__liveDataBySymbol).map(item => {

                            var symbolName = item[0];
                            var currentData = item[1];

                            __this.__chartDatasetBySymbol[symbolName].data = currentData;

                            __this.__chart.data.datasets.push(__this.__chartDatasetBySymbol[symbolName]);

                        })

                        __this.__chart.update();

                    }, refreshInterval);


                    let preloadCallback = __this.__getPreloadCallback();

                    let ProcessRequest = function () {

                        let request = __this.__serverRequests.shift();

                        if (!request) {

                            clearInterval(__this.cyclic);

                            __this.__chart.data.datasets = [];

                            Object.entries(__this.__liveDataBySymbol).map(item => {

                                var symbolName = item[0];
                                var currentData = item[1];

                                __this.__chartDatasetBySymbol[symbolName].data = currentData;

                                __this.__chart.data.datasets.push(__this.__chartDatasetBySymbol[symbolName]);


                            })

                            __this.__chart.update();

                            return;
                        }

                        __this.____serverRequestsId = TcHmi.Server.request(request, function (reply) { preloadCallback(reply); ProcessRequest(); });

                    }

                    ProcessRequest();


                }

                __getNewDataReceivedCallback() {
               
                    var __this = this;

                    return function (result) {

                        console.timeEnd('processRequest');

                        if (!__this.__isChartAttached()) return;

                        if (result.error === TcHmi.Errors.NONE && result.response) {
                            if (null !== result.response.error && void 0 !== result.response.error) {
                                console.log('Server error');
                                return;
                            }

                            if (result.response.id != __this.____serverRequestsId) return;

                            __this.____serverRequestsId = null;

                            if (null !== result.response.commands[0].error && void 0 !== result.response.commands[0].error) {

                                if (result.response.commands[0].error.message == 'INVALID_START_END')
                                    return;

                                if (result.response.commands[0].error.message == 'NODATA_FOUND')
                                    return;

                                console.log('response error');
                                console.log(result.response.commands[0].error);

                            } else if (null !== result.response.commands[0].readValue && void 0 !== result.response.commands[0].readValue) {

                                if (result.response.commands[0].symbol === __this.__serverDomain + ".GetTrendLineData") {
                                    if ((null !== result.response.commands[0].readValue.axesData && void 0 !== result.response.commands[0].readValue.axesData && result.response.commands[0].readValue.axesData.length > 0)) {

                                        let line = [];

                                        let requestDetails = JSON.parse(result.response.commands[0].customerData)

                                        for (let j = 0, jj = Math.min(result.response.commands[0].readValue.axesData[0].length, 2000) ; j < jj; j++) {

                                            let x = new Date(result.response.commands[0].readValue.axesData[0][j].x).getTime();

                                            if ( x < requestDetails.start )
                                                continue;

                                            if ( x > requestDetails.end )
                                                continue;

                                            let y = result.response.commands[0].readValue.axesData[0][j].y
                                            line.push({ x, y});

                                        }
                                        __this.__liveDataBySymbol[requestDetails.symbol] = line;
                                                                                      
                                    }
                                } 
                            }
                        }
                    }
                }

                __milliSecToIso(milliSec) {
                    if (0 === milliSec) return "PT0S";
                    let isneg = !1;
                    milliSec < 0 && ((isneg = !0), (milliSec *= -1));
                    let years = Math.floor(milliSec / 3154e7),
                      months = Math.floor((milliSec % 3154e7) / 2628e6),
                      days = Math.floor(((milliSec % 3154e7) % 2628e6) / 864e5),
                      hours = Math.floor((((milliSec % 3154e7) % 2628e6) % 864e5) / 36e5),
                      minutes = Math.floor(
                        ((((milliSec % 3154e7) % 2628e6) % 864e5) % 36e5) / 6e4
                      ),
                      seconds = Math.floor(
                        (((((milliSec % 3154e7) % 2628e6) % 864e5) % 36e5) % 6e4) / 1e3
                      ),
                      f = Math.floor(
                        (((((milliSec % 3154e7) % 2628e6) % 864e5) % 36e5) % 6e4) % 1e3
                      ),
                      isoString = "";
                    return (
                      isneg && (isoString += "-"),
                      (isoString += "P"),
                      years > 0 && (isoString += years + "Y"),
                      months > 0 && (isoString += months + "M"),
                      days > 0 && (isoString += days + "D"),
                      (hours > 0 || minutes > 0 || seconds > 0 || f > 0) &&
                        (isoString += "T"),
                      hours > 0 && (isoString += hours + "H"),
                      minutes > 0 && (isoString += minutes + "M"),
                      (seconds > 0 || (0 === days && 0 === hours && 0 === minutes)) &&
                        (isoString += seconds),
                      f > 0 &&
                        (isoString += "." + ("00" + f).slice(-3).replace(/\.?0+$/, "")),
                      (f > 0 || seconds > 0) && (isoString += "S"),
                      isoString
                    );
                }
                __isoToMilliSec(t) {
                    let seconds = 0,
                      minutes = 0,
                      hours = 0,
                      days = 0,
                      months = 0,
                      years = 0,
                      isneg = !1,
                      isTime = !1,
                      current = t.split("");
                    for (let i = 0, ii = current.length; i < ii; i++) {
                        let num = 0,
                          sNum = "";
                        for (
                          ;
                          (current[i] >= "0" && current[i] <= "9") || "." === current[i];

                        )
                            (sNum += current[i]), i++, (num = parseFloat(sNum));
                        switch (current[i]) {
                            case "-":
                                isneg = !0;
                                break;
                            case "Y":
                                years = num;
                                break;
                            case "D":
                                days = num;
                                break;
                            case "T":
                                isTime = !0;
                                break;
                            case "H":
                                hours = num;
                                break;
                            case "M":
                                isTime ? (minutes = num) : (months = num);
                                break;
                            case "S":
                                seconds = num;
                        }
                    }
                    let milliSec = 3154e7 * years;
                    return (
                      (milliSec += 2628e6 * months),
                      (milliSec += 864e5 * days),
                      (milliSec += 36e5 * hours),
                      (milliSec += 6e4 * minutes),
                      (milliSec += 1e3 * seconds),
                      isneg && (milliSec *= -1),
                      milliSec
                    );
                }
            }
            framework_apex_trend.frameworkapextrendcontrol = frameworkapextrendcontrol;
        })(framework_apex_trend = Controls.framework_apex_trend || (Controls.framework_apex_trend = {}));
    })(Controls = TcHmi.Controls || (TcHmi.Controls = {}));
})(TcHmi || (TcHmi = {}));
/**
* Register Control
*/
TcHmi.Controls.registerEx('frameworkapextrendcontrol', 'TcHmi.Controls.framework_apex_trend', TcHmi.Controls.framework_apex_trend.frameworkapextrendcontrol);
