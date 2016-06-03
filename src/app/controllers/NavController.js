import $ from 'jquery';
import Backbone from 'backbone';
import EventBus from 'helpers/EventBus';
import TweenMax from 'gsap';
import ScrollToPlugin from "gsap/src/uncompressed/plugins/ScrollToPlugin";

// IMPORT ALL CONTENT CLASSES AND TEMPLATES
import BaseView from 'views/content/BaseView';
import * as Sections from 'views/content/Content';
import * as Templates from 'templates/content/Templates';

export default class NavController extends Backbone.View {

    constructor(options) {
        super(options);
    }

    initialize() {
        console.log("NavController.initialize");

        this.$el = $("#content");
        this.sectionView = null;
        this.currentSectionModel = null;
    }

    /* NAV FUNCTIONS */
    start() {
        console.log("NavController.start");

        //TODO remove Cover page using REMOVE() method
        this.$el.empty();
        this.currentSectionModel = this.model.getCurrentItem();
        this.goto(this.currentSectionModel);
    }

    next() {
        console.log("NavController.next");
        this.goto(this.model.next());
    }

    prev() {
        console.log("NavController.previous");
        this.goto(this.model.prev());
    }

    goto(section) {
        if (section) {
            console.log("NavController.goto >>", section.id);

            // on goto(section), loop and render sections prior to the section.id
            // if next or prev section already on page, just scrollTo section.id
            // if next or prev section is a new chapter, remove all sectionViews and render next section
            // if nextChapter goto() first section
            // if prevChapter goto() first section
            //

            if (section.chapter.index == this.currentSectionModel.chapter.index) {
                //check if its the same chapter. If true, and already rendered, scroll to the section.

            } else {
                // TODO. Check for Zombie Views
                this.$el.empty();

            }

            var SectionView = Sections[section.id] || BaseView;
            var template = Templates[section.id];

            this.sectionView = new SectionView({
                id: section.id,
                model: section
            });
            this.sectionView.template = template;
            this.sectionView.bootstrap();

            this.model.save();
            this.model.trigger('change');

            this.render();
            this.scrollTo(section);

            this.currentSectionModel = section;
            EventBus.trigger(EventBus.event.NAV_CHANGE, this.model);
        }
    }

    nextChapter() {
        console.log("NavController.nextChapter");
        this.goto(this.model.next(true));
    }

    prevChapter() {
        console.log("NavController.prevChapter");
        this.goto(this.model.prev(true));
    }

    gotoChapter() {

    }

    /* HELPERS */
    render() {
        console.log("NavController.render");
        this.$el.append(this.sectionView.render().el);
    }

    scrollTo(section) {
        console.log("NavController.scrollTo:", section.id);

        var offsetTop = 80;
        var $section = $("#" + section.id);
        var duration = (section.index == 0) ? 0.25 : 0.75;

        TweenMax.to(window, duration, {
            scrollTo: {y: $section.offset().top - offsetTop, autoKill: false},
            ease: Power3.easeInOut,
            onComplete: this.onScrollComplete,
            onCompleteScope: this
        });
    }

    onScrollComplete() {
        this.sectionView.transitionIn();
    }
}
