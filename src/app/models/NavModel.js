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
        this.chapterTotalItems = [];
        this.maxIndex = 0;
        this.currentIndex = 0;
        this.lessonMode = "normal";

        // DATA FROM JSON
        this.data = AppData.nav;
        this.chapters = this.data.chapter;
        this.settings = AppData.settings;

        this.parse();
    }

    parse() {
        console.log("NavModel.parse");

        var sectionCount = 0;
        var chapterCount = 0;
        var idMask = this.settings.idMask;

        for (var c = 0; c < this.chapters.length; ++c) {
            var chapter = this.chapters[c];
            chapter.index = chapterCount++;
            chapter.total = this.chapters.length;

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
            this.chapterTotalItems.push(chapter.section.length)
        }
        this.totalItems = this.items.length;

        if (this.settings.lessonMode == "browse") {
            this.maxIndex = this.totalItems - 1;
        }

        //-- output info data
        console.log("--- NavModel Info ---");
        console.log("NavModel.chapter.length:", this.chapters.length);
        console.log("NavModel.chapterTotalItems:", this.chapterTotalItems.toString());
        console.log("NavModel.totalItems:", this.totalItems);
        console.log("----------------");
    }

    // TODO Refactor/optimize function
    next(skipChapter) {
        var currentChapter = this.getCurrentItem().chapter;

        if (skipChapter && currentChapter.index < currentChapter.total) {
            var nextChapterId = this.getCurrentItem().chapter.index + 1;
            this.currentIndex = this.chapters[nextChapterId].section[0].uid;
            this.maxIndex = Math.max(this.maxIndex, this.currentIndex);
            return this.getCurrentItem();

        } else if (this.currentIndex < this.totalItems - 1) {
            this.currentIndex++;
            this.maxIndex = Math.max(this.maxIndex, this.currentIndex);
            return this.getCurrentItem();
        }
        return null;
    }

    // TODO Refactor/optimize function
    prev(skipChapter) {
        if (skipChapter && this.getCurrentItem().chapter.index > 0) {
            var prevChapterId = this.getCurrentItem().chapter.index - 1;
            this.currentIndex = this.chapters[prevChapterId].section[0].uid;
            return this.getCurrentItem();
        } else if (this.currentIndex > 0) {
            this.currentIndex--;
            return this.getCurrentItem();
        }
        return null;
    }

    // TODO Refactor/optimize function
    goto(section) {
        if (section) {
            this.currentIndex = section.uid;
            this.maxIndex = Math.max(this.maxIndex, this.currentIndex);
            return this.getCurrentItem();
        }
        return null;
    }

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
        if (index > -1 && index < this.chapters.length) {
            return this.chapters[index];
        }
        return null;
    }

    getCurrentChapter() {
        return this.getChapter(this.getCurrentItem().chapter.index);
    }

    // TODO Refactor/optimize function
    getChaptersProgress() {
        var progress = [];
        for (var i = 0; i < this.chapters.length; ++i) {
            var maxSection = this.getMaxItem();
            var chapter = this.chapters[i];
            var progressObj = {
                global: 0,
                local: 0
            };

            var globalP = chapter.section.length / this.totalItems * 100;
            if (i < maxSection.chapter.index) {
                progressObj.global = globalP;
                progressObj.local = 100;
            } else if (i == maxSection.chapter.index) {
                var localP = (maxSection.index + 1) / maxSection.total;
                progressObj.global = globalP * localP;
                progressObj.local = Math.ceil(localP * 100);
            }

            progress.push(progressObj);
        }

        return progress;
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
