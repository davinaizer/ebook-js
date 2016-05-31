import $ from 'jquery';
import Backbone from 'backbone';
import EventBus from 'helpers/EventBus';
import Config from '../config.json';
import AppConfig from '../app.config.json';

export default class NavModel extends Backbone.Model {

    constructor(options) {
        super(options);
    }

    initialize() {
        console.log("NavModel.initialize");

        this.pageList = {};
        this.totalPages = 0;
        this.maxPageId = 0;
        this.currentPageId = 0;

        //current postion in Nav
        this.currentChapterId = 0;
        this.currentSectionId = 0;

        // total objects in Nav
        this.totalChapters = 0;
        this.totalSections = 0;

        // max page ID reached by the user.
        this.maxChapterId = 0;
        this.maxSectionId = 0;

        this.parse();
    }

    parse() {
        console.log("NavModel.parse");

        this.pageList = AppConfig.nav;
        this.totalPages = this.pageList.length;

        var uid = 0;
        for (var key in this.pageList) {
            this.pageList[key].uid = uid++;
        }

        /*
         var sectionCount = 0;
         var chapters = Config.nav.chapter;
         var maxChapter = chapters.length;
         for (var c = 0; c < maxChapter; ++c) {
         var chapter = chapters[c];
         var maxSection = chapter.section.length;
         for (var s = 0; s < maxSection; ++s) {
         var section = chapter.section[s];
         var sectionData = {
         uid:       sectionCount++,
         id:        s,
         chapterId: c,
         };
         $.extend(true, sectionData, section);
         console.log(sectionData);
         }

         }*/
    }

    getCurrentPage() {
        return this.pageList[this.currentPageId];
    }

    getPage(uid) {
        if (uid) {
            for (var key in this.pageList) {
                if (uid == this.pageList[key].uid) {
                    return this.pageList[key];
                }
            }
        }
        return null;
    }

    // SERIALIZATION FUNCTIONS -- SAVE AND RESTORE
    restore(data) {
        console.info("NavModel.restore: ", data);

        if (data && data.hasOwnProperty("NavModel")) {
            data = data.NavModel;
            for (var key in data) {
                if (this.hasOwnProperty(key)) {
                    this[key] = data[key];
                }
            }
            this.trigger("reset");
        }
    }

    save() {
        EventBus.trigger(EventBus.event.STATUS_UPDATE, {
            "cmi.suspend_data": {
                "NavModel": {
                    "currentPageId": this.currentPageId,
                    "maxPageId": this.maxPageId
                }
            }
        });
    }
}
