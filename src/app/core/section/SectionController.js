import _ from 'lodash';
import Backbone from 'backbone';
import EventBus from 'libs/EventBus';
import ScrollMagic from 'scrollmagic';
import ScrollToPlugin from 'gsap/src/uncompressed/plugins/ScrollToPlugin';
//require('scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js');
import TweenMax from 'gsap';

import ChapterNavView from 'core/navigation/ChapterNavView';
import SectionNavView from 'core/navigation/SectionNavView';
import SectionView from 'core/section/SectionView';

export default class SectionController extends Backbone.View {

  constructor(options) {
    Object.assign(options || {}, {});
    super(options);
  }

  initialize() {
    console.log('SectionController.initialize');

    this.scrollControl = new ScrollMagic.Controller({
      globalSceneOptions: {
        triggerHook: 'onCenter'
      }
    });
    this.scrollScenes = [];
    this.renderedViews = [];
    this.currentSectionModel = null;

    //-- CHECK FOR WINDOW RESIZE every 1s
    $(window).on('resize', _.throttle(() => {
      this.updateScenes();
    }, 1000));
  }

  /* NAV FUNCTIONS */
  start() {
    console.log('SectionController.start');

    this.sectionNav = new SectionNavView({ el: '#section-nav', model: this.model });
    this.sectionNav.render();

    this.$el.empty();
    this.currentSectionModel = this.model.getCurrentSection();
    this.goto(this.currentSectionModel);
  }

  next() {
    console.log('SectionController.next');
    this.goto(this.model.next());
  }

  prev() {
    console.log('SectionController.previous');
    this.goto(this.model.prev());
  }

  nextChapter() {
    console.log('SectionController.nextChapter');
    this.goto(this.model.next(true));
  }

  prevChapter() {
    console.log('SectionController.prevChapter');
    this.goto(this.model.prev(true));
  }

  gotoChapter(id) {
    let section = this.model.getChapter(id).section[0];
    this.goto(this.model.goto(section));
  }

  goto(section) {
    console.log('SectionController.goto(', section.id, ')');

    if (section) {
      this.model.goto(section);

      //save data before rendering page
      this.model.save();
      this.model.trigger('change');
      EventBus.trigger(EventBus.event.NAV_CHANGE, this.model);

      if (section.chapter.index === this.currentSectionModel.chapter.index) {
        if (this.renderedViews[section.index]) {
          this.scrollTo(section);
          return;
        }
      } else {
        console.log('SectionController.goto > New Chapter. Clear all Views.');

        for (let i = 0; i < this.renderedViews.length; ++i) {
          this.renderedViews[i].undelegateEvents();
          this.renderedViews[i].remove();
          this.scrollScenes[i].destroy();
        }

        // clear all
        this.renderedViews = [];
        this.scrollScenes = [];
        this.sectionNav.render();
        this.chapterNav ? this.chapterNav.remove() : null;
        this.$el.empty();

        $(window).scrollTop(0);
      }

      this.render(section);
      this.scrollTo(section);
    }
  }

  /* REDERING VIEWS */
  render(section) {
    console.log('SectionController.render');

    let chapter = this.model.getChapter(section.chapter.index);
    let firstSection = chapter.section[0];
    let maxSection = this.model.getMaxSection();
    let sectionsToRender = (maxSection.chapter.index > section.chapter.index) ? section.total : maxSection.index + 1;

    for (let i = 0; i < sectionsToRender; ++i) {
      if (!this.renderedViews[i]) {
        let nextSection = this.model.getSection(firstSection.uid + i);
        let nextSectionView = this.getSectionView(nextSection);

        this.$el.append(nextSectionView.render().el);

        //-- hide next btn from section already visited
        if (nextSection.uid < maxSection.uid) {
          nextSectionView.hideNextBtn();
          nextSectionView.isVisited = true;
        }
        nextSectionView.bootstrap();
        nextSectionView.transitionIn();

        this.renderedViews.push(nextSectionView);

        // SCROLLMAGIC SCENES
        this.scrollScenes[i] = new ScrollMagic.Scene({
            triggerElement: nextSectionView.el,
            duration: nextSectionView.$el.height()
          })
          //.addIndicators()
          .setClassToggle('#section-nav-item-' + nextSection.uid, 'active')
          .addTo(this.scrollControl)
          .on('enter', $.proxy(this.onSectionEnter, this, nextSection));
      }
    }

    // show chapterNav if last section
    if (sectionsToRender === section.total) {
      this.chapterNav = new ChapterNavView({ model: this.model });
      this.$el.append(this.chapterNav.render().el);
    }

    // wait before recheck section sizes
    _.delay(() => { this.updateScenes() }, 1000);
  }

  onSectionEnter(section) {
    this.currentSectionModel = section;
    this.model.currentIndex = section.uid;
    this.sectionNav.validate();
  }

  updateScenes() {
    $.each(this.scrollScenes, (index, scene) => {
      scene.duration(this.renderedViews[index].$el.height());
    });
  }

  getSectionView(section) {
    let SectionViewClass = this.model.getSectionView(section.id) || SectionView;
    let sectionView = new SectionViewClass({
      id: section.id,
      model: section
    });
    sectionView.navModel = this.model;
    sectionView.template = this.model.getSectionTemplate(section.id) || {};

    return sectionView;
  }

  scrollTo(section) {
    console.log('SectionController.scrollTo > uid:' + section.uid + ', id:', section.id);

    this.updateScenes();
    let offsetTop = 80;
    let $section = this.$('#' + section.id);
    let duration = 0.75;

    TweenMax.to(window, duration, {
      scrollTo: { y: $section.offset().top - offsetTop, autoKill: false },
      ease: Power3.easeInOut
    });
  }
}
