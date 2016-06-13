import $ from 'jquery';
import Backbone from 'backbone';
import EventBus from 'helpers/EventBus';
import AppData from '../data/config.json';

export default class NavModel extends Backbone.Model {

    constructor(options) {
        super(options);
    }

    initialize() {
        console.log("NavModel.initialize");

        this.sectionList = [];
        this.totalSections = 0;
        this.chapterTotalSections = [];
        this.maxIndex = 1;
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

            var chapterRef = Object.assign({}, chapter);
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

                Object.assign(section, sectionData);
                this.sectionList.push(chapter.section[s]);
            }
            this.chapterTotalSections.push(chapter.section.length)
        }
        this.totalSections = this.sectionList.length;

        if (this.settings.lessonMode == "browse") {
            this.maxIndex = this.totalSections - 1;
        }

        //-- output info data
        console.log("--- NavModel Info ---");
        console.log("NavModel.chapter.length:", this.chapters.length);
        console.log("NavModel.chapterTotalSections:", this.chapterTotalSections.toString());
        console.log("NavModel.totalSections:", this.totalSections);
        console.log("----------------");
    }

    // TODO Refactor/optimize function
    next(skipChapter) {
        if (skipChapter && this.currentChapter.index < this.currentChapter.total) {
            var nextChapterId = this.currentChapter.index + 1;
            this.currentIndex = this.chapters[nextChapterId].section[0].uid;
            this.maxIndex = Math.max(this.maxIndex, this.currentIndex);
            return this.currentSection;

        } else if (this.currentIndex < this.totalSections - 1) {
            this.currentIndex++;
            this.maxIndex = Math.max(this.maxIndex, this.currentIndex);
            return this.currentSection;
        }
        return null;
    }

    // TODO Refactor/optimize function
    prev(skipChapter) {
        if (skipChapter && this.currentChapter.index > 0) {
            var prevChapterId = this.currentChapter.index - 1;
            this.currentIndex = this.chapters[prevChapterId].section[0].uid;
            return this.currentSection;
        } else if (this.currentIndex > 0) {
            this.currentIndex--;
            return this.currentSection;
        }
        return null;
    }

    // TODO Refactor/optimize function
    goto(section) {
        if (section) {
            this.currentIndex = section.uid;
            this.maxIndex = Math.max(this.maxIndex, this.currentIndex);
            return this.currentSection;
        }
        return null;
    }

    /* GETTERS */

    getSection(uid) {
        if (uid >= 0 && uid < this.totalSections) {
            return this.sectionList[uid];
        }
        return null;
    }

    getChapter(index) {
        if (index > -1 && index < this.chapters.length) {
            return this.chapters[index];
        }
        return null;
    }

    get maxSection() {
        return this.sectionList[this.maxIndex];
    }

    get currentSection() {
        return this.getSection(this.currentIndex);
    }

    get currentChapter() {
        return this.getChapter(this.currentSection.chapter.index);
    }

    // TODO Refactor/optimize function
    get chaptersProgress() {
        var progress = [];
        for (var i = 0; i < this.chapters.length; ++i) {
            var maxSection = this.maxSection;
            var chapter = this.chapters[i];

            var progressObj = {
                title: chapter.title,
                global: chapter.section.length / this.totalSections,
                user: 1
            };

            if (i == maxSection.chapter.index) {
                var userP = (maxSection.index + 1) / maxSection.total;
                progressObj.user = userP;
            } else if (i > maxSection.chapter.index) {
                progressObj.user = 0;
            }
            progress.push(progressObj);
        }

        return progress;
    }

    get globalProgress() {
        return ((this.maxIndex + 1) / this.totalSections * 100).toFixed(0);
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
