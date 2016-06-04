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

        this.items = [];
        this.totalItems = 0;
        this.maxIndex = 0;
        this.currentIndex = 0;

        // DATA FROM JSON
        this.data = AppData.nav;
        this.settings = AppData.settings;
        this.parse();
    }

    parse() {
        console.log("NavModel.parse");

        var sectionCount = 0;
        var chapterCount = 0;
        var chapters = this.data.chapter;
        var idMask = this.settings.idMask;

        for (var c = 0; c < chapters.length; ++c) {
            var chapter = chapters[c];
            chapter.index = chapterCount++;
            chapter.total = chapters.length;

            var chapterRef = $.extend({}, chapter);
            delete chapterRef.section;

            for (var s = 0; s < chapter.section.length; ++s) {
                var section = chapter.section[s];
                var sectionId = idMask.replace("{{chapterIndex}}", c).replace("{{sectionIndex}}", s);
                var sectionData = {
                    uid: sectionCount++,
                    id: sectionId,
                    index: s,
                    total: chapter.section.length,
                    chapter: chapterRef
                };

                $.extend(section, sectionData);
                this.items.push(chapter.section[s]);
            }
        }
        this.totalItems = this.items.length;
    }

    next(skipChapter) {
        // TODO Refactor/optmize code
        var currentChapter = this.getCurrentItem().chapter;

        if (skipChapter && currentChapter.index < currentChapter.total) {
            var nextChapterId = this.getCurrentItem().chapter.index + 1;
            this.currentIndex = this.data.chapter[nextChapterId].section[0].uid;

            this.maxIndex = Math.max(this.maxIndex, this.currentIndex);
            return this.getCurrentItem();

        } else if (this.currentIndex < this.totalItems - 1) {
            this.currentIndex++;
            
            this.maxIndex = Math.max(this.maxIndex, this.currentIndex);
            return this.getCurrentItem();
        }
        return null;
    }

    prev(skipChapter) {
        if (skipChapter && this.getCurrentItem().chapter.index > 0) {
            var prevChapterId = this.getCurrentItem().chapter.index - 1;
            this.currentIndex = this.data.chapter[prevChapterId].section[0].uid;
            return this.getCurrentItem();
        } else if (this.currentIndex > 0) {
            this.currentIndex--;
            return this.getCurrentItem();
        }
        return null;
    }

    goto(uid) {}

    getItem(uid) {
        if (uid >= 0 && uid < this.totalItems) {
            return this.items[uid];
        }
        return null;
    }

    getCurrentItem() {
        return this.getItem(this.currentIndex);
    }

    getMaxItem() {
        return this.items[this.maxIndex];
    }

    getChapter(index) {
        if (index > -1 && index < this.data.chapter.length) {
            return this.data.chapter[index];
        }
        return null;
    }

    getCurrentChapter() {
        this.getChapter(this.getCurrentItem().chapter.index);
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
                    "currentIndex": this.currentIndex,
                    "maxIndex": this.maxIndex
                }
            }
        });
    }
}
