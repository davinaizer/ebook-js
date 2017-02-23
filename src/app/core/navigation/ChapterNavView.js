import $ from 'jquery';
import Backbone from 'backbone';
import Bootstrap from 'bootstrap-sass';
import EventBus from 'libs/EventBus';

import Template from 'core/navigation/ChapterNav.hbs';

export default class ChapterNavView extends Backbone.View {

  constructor(options) {
    Object.assign(options || {}, {
      id: 'chapter-guide',
      events: {
        'click #btn-next-chapter': 'nextChapter',
        'click #btn-prev-chapter': 'prevChapter',
        'click li': 'chapterNav'
      }
    });
    super(options);
  }

  initialize() {
    console.log('ChapterNavView.initialize');
    this.template = Template;
    this.chapters = this.model.chapters;
  }

  render() {
    console.log('ChapterNavView.render');
    this.$el.hide();
    this.$el.html(this.template(this));
    this.$el.fadeIn(500);

    this.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
    this.validate();

    return this;
  }

  validate() {
    let currentChapter = this.model.getCurrentChapter();

    if (currentChapter.index === 0) {
      this.$('#btn-prev-chapter').hide();
    } else if (currentChapter.index === currentChapter.total - 1) {
      this.$('#btn-next-chapter').hide();
    }

    //-- validate chapter guide
    let maxChapter = this.model.getMaxSection().chapter;
    let nextChapterId = maxChapter.index + 1;

    this.$('li').each((index, el) => {
      if (currentChapter.index === index) {
        $(el).addClass('active').attr('disabled', true);
      } else if (index === nextChapterId) {
        $(el).addClass('next');
      } else if (index > nextChapterId) {
        $(el).addClass('disabled').attr('disabled', true);
      }
    });
  }

  prevChapter(e) {
    e.preventDefault();
    EventBus.trigger(EventBus.event.NAV_PREVIOUS_CHAPTER);
  }

  nextChapter(e) {
    e.preventDefault();
    EventBus.trigger(EventBus.event.NAV_NEXT_CHAPTER);
  }

  chapterNav(e) {
    let $target = this.$(e.currentTarget);
    let chapterId = $target.find('a').attr('href').split('chapter/')[1];
    let isEnabled = !$target.is('[disabled]');

    if (isEnabled) {
      EventBus.trigger(EventBus.event.NAV_GOTO_CHAPTER, { chapterId: chapterId });
    }
    e.preventDefault();
  }
}
