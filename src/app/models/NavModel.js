import $ from 'jquery';
import Backbone from 'backbone';
import EventBus from 'helpers/EventBus';
import AppData from '../config.json';

export default class NavModel extends Backbone.Model {

    constructor(options) {
        super(options);
    }

    initialize() {
        console.log("NavModel.initialize");

        this.sectionList = [];
        this.sectionIndex = 0;
        this.totalSections = 0;
        this.maxSectionIndex = 0;
        this.parse();
    }

    parse() {
        console.log("NavModel.parse");

        var sectionCount = 0;
        var chapterCount = 0;
        var chapters = AppData.nav.chapter;
        var sectionIdMask = AppData.settings.idMask;

        for (var c = 0; c < chapters.length; ++c) {
            var chapter = chapters[c];
            chapter.index = chapterCount++;
            chapter.total = chapters.length;

            var chapterRef = $.extend({}, chapter);
            delete chapterRef.section;

            for (var s = 0; s < chapter.section.length; ++s) {
                var section = chapter.section[s];
                var sectionId = sectionIdMask.replace("{{chapterIndex}}", c).replace("{{sectionIndex}}", s);
                var sectionData = {
                    uid: sectionCount++,
                    id: sectionId,
                    index: s,
                    total: chapter.section.length,
                    chapter: chapterRef
                };

                $.extend(true, sectionData, section);
                this.sectionList.push(sectionData);
            }
        }
        this.totalSections = this.sectionList.length;
    }

    getSection(uid) {
        if (uid >= 0 && uid < this.totalSections) {
            return this.sectionList[uid];
        }
        return null;
    }

    getCurrentSection() {
        return this.getSection(this.sectionIndex);
    }

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
                    "sectionIndex": this.sectionIndex,
                    "maxSectionIndex": this.maxSectionIndex
                }
            }
        });
    }
}
