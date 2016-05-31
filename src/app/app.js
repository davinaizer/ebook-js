import $ from 'jquery';
import Backbone from 'backbone';
import EventBus from 'helpers/EventBus';

import NavController from 'controllers/NavController';
import PageController from 'controllers/PageController';

import NavModel from 'models/NavModel';
import StatusModel from 'models/StatusModel';

import CoverPageView from 'views/CoverView';
import NavbarView from 'views/NavView';

export default Backbone.View.extend({

    initialize() {
        this.version = "v1.0.0-alpha";

        console.info("UNBOX® Learning Experience 2009-2016 — eBookJS " + this.version);
        console.log("App.init");

        //-- MODELS
        this.navModel = new NavModel();
        this.statusModel = new StatusModel();

        //-- VIEWS
        this.coverPageView = new CoverPageView({model: this.statusModel});
        this.navbarView = new NavbarView({model: this.navModel});

        //-- CONTROLLERS-VIEWS
        this.navControl = new NavController({model: this.navModel});
        this.pageControl = new PageController();
    },

    bootstrap() {
        console.log("App.bootstrap");

        //-- wait for window close
        $(window).on('unload', $.proxy(this.statusModel.quit, this.statusModel));

        this.coverPageView.render();

        EventBus.on(EventBus.event.NAV_GOTO, (page) => {
            this.navControl.goto(page);
        });

        EventBus.on(EventBus.event.NAV_NEXT, () => {
            this.navControl.next();
        });

        EventBus.on(EventBus.event.NAV_PREVIOUS, () => {
            this.navControl.previous();
        });

        EventBus.once(EventBus.event.PAGE_LOAD, () => {
            this.navbarView.render();
        });

        EventBus.on(EventBus.event.PAGE_LOAD, (page) => {
            this.pageControl.fetch(page);
        });

        EventBus.on(EventBus.event.PAGE_LOADED, () => {
            this.pageControl.render();
        });

        EventBus.on(EventBus.event.PAGE_TRANSITION_IN_COMPLETE, () => {
            this.navbarView.onTransitionInComplete();
        });

        EventBus.once(EventBus.event.STATUS_LOADED, (data) => {
            this.navModel.restore(data);
            this.navControl.start();
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
    }
});
