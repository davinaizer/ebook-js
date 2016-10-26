'use strict';

/* LIBS */
import $ from 'jquery';
import Backbone from 'backbone';
import EventBus from 'libs/EventBus';

/* CORE CLASSES */
import CoverView from 'core/section/cover/CoverView';
import NavbarView from 'core/layout/NavbarView';
import NavModel from 'core/navigation/NavModel';
import SectionController from 'core/section/SectionController';
import ScormService from 'core/scorm/ScormService';

export default class App extends Backbone.View {

  constructor(options) {
    Object.assign(options || {}, {});
    super(options);
  }

  initialize() {
    const appVersion = 'v2.0.0-beta';

    console.info('UNBOX® Learning Experience — 2009-2016 — eBookJS Fluid ' + appVersion);
    console.log('App.init');

    //-- MODELS
    this.navModel = new NavModel();
    this.scormService = new ScormService();

    //-- VIEWS
    this.coverView = new CoverView({ el: '#content', model: this.navModel });
    this.navbarView = new NavbarView({ el: '#navbar', model: this.navModel });

    //-- VIEWS-CONTROLLERS
    this.sectionControl = new SectionController({ el: '#content', model: this.navModel });
  }

  bootstrap() {
    console.log('App.bootstrap');

    this.initEvents();
    this.scormService.fetch();
  }

  initEvents() {
    //-- wait for window close
    $(window).on('unload', () => {
      this.navModel.save();
      this.scormService.quit();
    });

    /* NAV EVENTS */
    EventBus.on(EventBus.event.NAV_START, () => {
      this.navbarView.render();
      this.sectionControl.start();
    });

    EventBus.on(EventBus.event.NAV_NEXT, () => {
      this.sectionControl.next();
    });

    EventBus.on(EventBus.event.NAV_PREVIOUS, () => {
      this.sectionControl.prev();
    });

    EventBus.on(EventBus.event.NAV_GOTO, (data) => {
      this.sectionControl.goto(data.section);
    });

    EventBus.on(EventBus.event.NAV_NEXT_CHAPTER, () => {
      this.sectionControl.nextChapter();
    });

    EventBus.on(EventBus.event.NAV_PREVIOUS_CHAPTER, () => {
      this.sectionControl.prevChapter();
    });

    EventBus.on(EventBus.event.NAV_GOTO_CHAPTER, (data) => {
      this.sectionControl.gotoChapter(data.chapterId);
    });

    /* STATUS MODEL EVENTS */
    EventBus.once(EventBus.event.STATUS_LOADED, (data) => {
      this.navModel.restore(data.suspendData);
      this.coverView.render();
    });

    EventBus.once(EventBus.event.STATUS_FINISH, () => {
      this.scormService.finish();
    });

    EventBus.on(EventBus.event.STATUS_UPDATE, (data) => {
      this.scormService.update(data);
    });

    EventBus.on(EventBus.event.STATUS_SAVE, () => {
      this.scormService.save();
    });

    EventBus.on(EventBus.event.STATUS_DISPATCH, () => {
      this.scormService.dispatchSuspendData();
    });

    /* OTHERS */
    EventBus.on(EventBus.event.PAGE_TRANSITION_IN_COMPLETE, () => {
      this.navbarView.onTransitionInComplete();
    });
  }
}
