import $ from 'jquery';
import Backbone from 'backbone';
import EventBus from 'helpers/EventBus';
import SCORM from '../libs/SCORM_API';

export default class StatusModel extends Backbone.Model {

    constructor(options) {
        super(options);
    }

    initialize() {
        console.log("StatusModel.initialize");

        this.scorm = SCORM.SCORM;
        this.scorm.version = "1.2";
        this.isAvailable = false;
        this.lessonMode = "normal";
        this.lessonStatus = "incomplete";
        this.suspendData = {};
    }

    fetch() {
        console.log("StatusModel.fetch");

        this.isAvailable = this.scorm.init();

        if (this.isAvailable && this.lessonMode == "normal") {
            console.log("StatusModel.isAvailable ?" + this.isAvailable);

            //-- Check for first time SCO launch
            //this.scorm.get("cmi.core.entry") === "ab-initio"
            this.lessonStatus = this.getParam("cmi.core.lesson_status");
            this.suspendData = this.getParam("cmi.suspend_data");

            if (this.suspendData !== "" && this.suspendData !== undefined && this.suspendData !== null) {
                console.info("Resuming... Reading STATUS from SUSPEND_DATA.");

                this.suspendData = this.suspendData.replace(/'/g, "\"");
                this.suspendData = JSON.parse(this.suspendData);

                if (this.lessonStatus === "completed") {
                    alert("Você já completou este módulo.");
                }
            } else {
                console.info("First time SCO launch. Setting initial data.");

                this.suspendData = {};
                var scormData = {
                    "cmi.core.lesson_status": "incomplete",
                    "cmi.core.exit": "suspend",
                    "cmi.suspend_data": this.suspendData
                };
                this.update(null, scormData);
            }
        } else {
            console.warn("SCORM API not available. Setting lessonMode = 'browse'.");
            this.lessonMode = "browse";
        }

        EventBus.trigger(EventBus.event.STATUS_LOADED, this.suspendData);
    }

    setParam(param, value) {
        var success = this.scorm.set(param, value);
        console.log("StatusModel.setParam(", param, ") =>", value, ":", success);
    }

    getParam(param) {
        var ret = this.scorm.get(param);
        console.log("StatusModel.getParam(", param, ") =>", ret);
        return ret;
    }

    update(data) {
        if (this.isAvailable) {
            if (this.lessonStatus !== "completed") {
                for (var key in data) {
                    if (key.indexOf("suspend_data") > -1) {
                        $.extend(true, this.suspendData, data[key]);
                        data[key] = JSON.stringify(this.suspendData).replace(/"/g, "'");
                    }
                    this.setParam(key, data[key]);
                }
                this.save();
            } else {
                console.warn("StatusModel.update: LESSON_STATUS == COMPLETED. Can't update SCORM Data!");
            }
        } else if (this.lessonMode === "normal") {
            console.warn("SCORM API not available. Can't update SCORM Data!");
        }
    }

    save() {
        var success = this.scorm.save();
        console.log("StatusModel.save:", success);
    }

    dispatchSuspendData() {
        EventBus.trigger(EventBus.event.STATUS_LOADED, this.suspendData);
    }

    finish() {
        console.log("StatusModel.finish");
        if (this.lessonStatus === "incomplete") {
            this.lessonStatus = "completed";
            this.setParam("cmi.core.lesson_status", this.lessonStatus);
            this.save();
        } else {
            console.warn("Lesson already Completed! Cannot finish again!");
        }
    }

    quit() {
        console.log("StatusModel.quit");
        if (this.isActive) {
            this.save();
            this.scorm.quit();
        }
    }
}

