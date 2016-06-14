'use strict';

import $ from 'jquery';
import Backbone from 'backbone';
import EventBus from 'helpers/EventBus';
import ConsoleFix from 'helpers/ConsoleFix';

/* MODELS */
import NavModel from 'models/NavModel';
import StatusModel from 'models/StatusModel';

/* VIEWS */
import CoverPageView from 'views/CoverView';
import NavbarView from 'views/components/NavbarView';

/* CONTROLLERS */
import NavController from 'controllers/NavController';

export default Backbone.View.extend({

    initialize() {
        this.version = "v1.0.0-alpha";

        console.info("UNBOX® Learning Experience 2009-2016 — eBookJS " + this.version);
        console.log("App.init");

        //-- MODELS
        this.navModel = new NavModel();
        this.statusModel = new StatusModel();

        //-- VIEWS
        this.coverPageView = new CoverPageView({el: '#content', model: this.navModel});
        this.navbarView = new NavbarView({el: '#navbar', model: this.navModel});

        //-- VIEWS-CONTROLLERS
        this.navControl = new NavController({el: '#content', model: this.navModel});
    },

    bootstrap() {
        console.log("App.bootstrap");

        this.initEvents();

        // load SCORM DATA
        this.statusModel.fetch();
    },

    initEvents(){
        //-- wait for window close
        $(window).on('unload', () => {
            this.navModel.save();
            this.statusModel.quit();
        });

        /* NAV EVENTS */
        EventBus.on(EventBus.event.NAV_START, () => {
            this.navbarView.render();
            this.navControl.start();
        });

        EventBus.on(EventBus.event.NAV_NEXT, () => {
            this.navControl.next();
        });

        EventBus.on(EventBus.event.NAV_PREVIOUS, () => {
            this.navControl.prev();
        });

        EventBus.on(EventBus.event.NAV_GOTO, (section) => {
            this.navControl.goto(section);
        });

        EventBus.on(EventBus.event.NAV_NEXT_CHAPTER, () => {
            this.navControl.nextChapter();
        });

        EventBus.on(EventBus.event.NAV_PREVIOUS_CHAPTER, () => {
            this.navControl.prevChapter();
        });

        EventBus.on(EventBus.event.NAV_GOTO_CHAPTER, (id) => {
            this.navControl.gotoChapter(id);
        });

        /* STATUS MODEL EVENTS */
        EventBus.once(EventBus.event.STATUS_LOADED, (data) => {
            this.navModel.restore(data);
            this.coverPageView.render();
        });

        EventBus.once(EventBus.event.STATUS_FINISH, () => {
            this.statusModel.finish();
        });

        EventBus.on(EventBus.event.STATUS_UPDATE, (data) => {
            this.statusModel.update(data);
        });

        EventBus.on(EventBus.event.STATUS_SAVE, () => {
            this.statusModel.save();
        });

        EventBus.on(EventBus.event.STATUS_DISPATCH, () => {
            this.statusModel.dispatchSuspendData();
        });

        /* OTHERS */
        EventBus.on(EventBus.event.PAGE_TRANSITION_IN_COMPLETE, () => {
            this.navbarView.onTransitionInComplete();
        });
    }
});
