import $ from 'jquery';
import Backbone from 'backbone';
import EventBus from 'helpers/EventBus';
import AppConfig from '../app.config.json';

export default Backbone.Model.extend({

    initialize() {
        console.log("NavModel.initialize");

        this.pageList = {};
        this.totalPages = 0;
        this.maxPageId = 0;
        this.currentPageId = 0;

        this.parse();
    },

    parse() {
        console.log("NavModel.parse");

        this.pageList = AppConfig.nav;
        this.totalPages = this.pageList.length;

        var uid = 0;
        for (var key in this.pageList) {
            this.pageList[key].uid = uid++;
        }
    },

    restore(data) {
        console.info("NavModel.restore: ", data);

        if (data.hasOwnProperty("NavModel")) {
            data = data.NavModel;
            for (var key in data) {
                if (this.hasOwnProperty(key)) {
                    this[key] = data[key];
                }
            }
        }
        this.trigger("reset");
    },

    save() {
        EventBus.trigger(EventBus.event.STATUS_UPDATE, {
            "cmi.suspend_data": {
                "NavModel": {
                    "currentPageId": this.currentPageId,
                    "maxPageId": this.maxPageId
                }
            }
        });
    },

    getCurrentPage() {
        return this.pageList[this.currentPageId];
    },

    getPageByUid(uid) {
        for (var key in this.pageList) {
            if (uid == this.pageList[key].uid) {
                return this.pageList[key];
            }
        }
        return null;
    }
});
