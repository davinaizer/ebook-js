import AppConfig from 'app/AppConfig.json';
import Backbone from 'backbone';
import EventBus from 'libs/EventBus';

// TODO Make Sections And Templates an Setter method, instead of this
import * as SectionViews from 'content/SectionViews';
import * as SectionTemplates from 'content/SectionTemplates';

export default class NavModel extends Backbone.Model {

  constructor(options) {
    options = Object.assign(options || {}, {});
    super(options);
  }

  initialize() {
    console.log('NavModel.initialize');

    this.sectionList = [];
    this.totalSections = 0;
    this.chapterTotalSections = [];
    this.maxIndex = 0;
    this.currentIndex = 0;
    this.lessonMode = 'normal';

    // DATA FROM JSON
    this.chapters = AppConfig.nav;
    this.settings = AppConfig.settings;

    this.parse();
  }

  parse() {
    console.log('NavModel.parse');

    let sectionCount = 0;
    let chapterCount = 0;
    let idMask = this.settings.idMask;

    for (let c = 0; c < this.chapters.length; ++c) {
      let chapter = this.chapters[c];
      chapter.index = chapterCount++;
      chapter.total = this.chapters.length;

      let chapterRef = Object.assign({}, chapter);
      delete chapterRef.section;

      for (let s = 0; s < chapter.section.length; ++s) {
        let section = chapter.section[s];
        let sectionId = idMask.replace('{{chapterIndex}}', c).replace('{{sectionIndex}}', s);
        let sectionData = {
          uid: sectionCount++,
          id: sectionId,
          index: s,
          total: chapter.section.length,
          chapter: chapterRef
        };

        Object.assign(section, sectionData);
        this.sectionList.push(chapter.section[s]);
      }
      this.chapterTotalSections.push(chapter.section.length);
    }
    this.totalSections = this.sectionList.length;

    if (this.settings.lessonMode === 'browse') {
      this.maxIndex = this.totalSections - 1;
    }

    //-- output info data
    console.log('--- NavModel Info ---');
    console.log('NavModel.chapter.length:', this.chapters.length);
    console.log('NavModel.chapterTotalSections:', this.chapterTotalSections.toString());
    console.log('NavModel.totalSections:', this.totalSections);
    console.log('----------------');
  }

  // TODO Refactor/optimize function
  next(skipChapter) {
    if (skipChapter && this.getCurrentChapter().index < this.getCurrentChapter().total) {
      let nextChapterId = this.getCurrentChapter().index + 1;
      this.currentIndex = this.chapters[nextChapterId].section[0].uid;
      this.maxIndex = Math.max(this.maxIndex, this.currentIndex);
      return this.getCurrentSection();

    } else if (this.currentIndex < this.totalSections - 1) {
      this.currentIndex++;
      this.maxIndex = Math.max(this.maxIndex, this.currentIndex);
      return this.getCurrentSection();
    }
    return null;
  }

  // TODO Refactor/optimize function
  prev(skipChapter) {
    if (skipChapter && this.getCurrentChapter().index > 0) {
      let prevChapterId = this.getCurrentChapter().index - 1;
      this.currentIndex = this.chapters[prevChapterId].section[0].uid;
      return this.getCurrentSection();
    } else if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.getCurrentSection();
    }
    return null;
  }

  // TODO Refactor/optimize function
  goto(section) {
    if (section) {
      this.currentIndex = section.uid;
      this.maxIndex = Math.max(this.maxIndex, this.currentIndex);
      return this.getCurrentSection();
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

  getMaxSection() {
    return this.sectionList[this.maxIndex];
  }

  getCurrentSection() {
    return this.getSection(this.currentIndex);
  }

  getCurrentChapter() {
    return this.getChapter(this.getCurrentSection().chapter.index);
  }

  // TODO Refactor/optimize function
  getChaptersProgress() {
    let progress = [];

    for (let i = 0; i < this.chapters.length; ++i) {
      let maxSection = this.getMaxSection();
      let chapter = this.chapters[i];
      let progressObj = {
        title: chapter.title,
        global: chapter.section.length / this.totalSections,
        user: 1
      };

      if (i === maxSection.chapter.index) {
        let userP = (maxSection.index + 1) / maxSection.total;
        progressObj.user = userP;
      } else if (i > maxSection.chapter.index) {
        progressObj.user = 0;
      }
      progress.push(progressObj);
    }

    return progress;
  }

  getGlobalProgress() {
    return ((this.maxIndex + 1) / this.totalSections * 100).toFixed(0);
  }

  getSectionView(id) {
    if (id) {
      return SectionViews[id];
    }
    return null;
  }

  getSectionTemplate(id) {
    if (id) {
      return SectionTemplates[id];
    }
    return null;
  }

  restore(data) {
    console.info('NavModel.restore: ', data);

    if (data && data.hasOwnProperty('NavModel')) {
      data = data.NavModel;
      for (let key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
      this.trigger('reset');
    }
  }

  save() {
    EventBus.trigger(EventBus.event.STATUS_UPDATE, {
      'cmi.suspend_data': {
        'NavModel': {
          'currentIndex': this.currentIndex,
          'maxIndex': this.maxIndex
        }
      }
    });
  }
}
