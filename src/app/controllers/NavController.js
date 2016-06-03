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
        this.renderedViews = [];
        this.currentSectionView = null;
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

    nextChapter() {
        console.log("NavController.nextChapter");
        this.goto(this.model.next(true));
    }

    prevChapter() {
        console.log("NavController.prevChapter");
        this.goto(this.model.prev(true));
    }

    goto(section) {
        if (section) {
            console.log("NavController.goto >>", section.id);

            // if next Section is in the same Chapter of the currentSection, if not, remove all renderedViews[] and render nextSection
            if (section.chapter.index == this.currentSectionModel.chapter.index) {
                // check if sectionView exists, if so scrollTo(it), if not, render
                if (this.renderedViews[section.index]) {
                    this.scrollTo(section.id);
                } else {
                    this.render(section);
                }
            } else {
                for (var i = 0; i < this.renderedViews.length; ++i) {
                    this.renderedViews[i].remove();
                }
                this.$el.empty();
                this.renderedViews = [];
                this.render(section);
            }
        }
    }

    /* REDERING VIEWS */
    render(section) {
        console.log("NavController.render:");

        /* BETA CODE */
        var firstSectionUid = section.uid - section.index;
        var lastSectionIndex = section.total - 1;
        var lastSectionUid = section.uid + lastSectionIndex - section.index;
        var maxSectionUid = this.model.getMaxItem().uid;
        lastSectionUid = Math.min(lastSectionUid, maxSectionUid) + 1;

        var range = lastSectionUid - firstSectionUid;
        console.log("render.range:", range);
        console.log("goto.rangeToRender:", firstSectionUid, " - ", lastSectionUid);

        for (var i = 0; i < range; ++i) {
            if (!this.renderedViews[i]) {
                var nextSection = this.model.getItem(firstSectionUid + i);
                var nextSectionView = this.getSectionView(nextSection);
                nextSectionView.bootstrap();

                this.$el.append(nextSectionView.render().el);
                nextSectionView.transitionIn();

                this.renderedViews.push(nextSectionView);
            }
        }
        /* END BETA CODE */
        this.currentSectionModel = section;
        this.scrollTo(section);

        //-- GET VIEW
        this.model.save();
        this.model.trigger('change');

        EventBus.trigger(EventBus.event.NAV_CHANGE, this.model);
    }

    getSectionView(section) {
        var SectionViewClass = Sections[section.id] || BaseView;
        var SectionView = new SectionViewClass({
            id: section.id,
            model: section
        });
        SectionView.template = Templates[section.id];

        return SectionView;
    }

    scrollTo(section) {
        console.log("NavController.scrollTo:", section.id);

        var offsetTop = 80;
        var $section = $("#" + section.id);
        var duration = (section.index == 0) ? 0.25 : 0.75;

        TweenMax.to(window, duration, {
            scrollTo: {y: $section.offset().top - offsetTop, autoKill: false},
            ease: Power3.easeInOut
        });
    }
}
