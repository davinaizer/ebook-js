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
        var chapter = this.model.getChapter(section.chapter.index);
        console.log("chapters >", chapter);

        var firstSection = chapter.section[0];
        // var lastSection = chapter.section[chapter.section.length - 1];
        var maxSection = this.model.getMaxItem();

        var sectionsToRender = 0;
        if (maxSection.chapter.index > section.chapter.index) {
            sectionsToRender = section.total;
        } else {
            sectionsToRender = maxSection.index + 1;
        }

        for (var i = 0; i < sectionsToRender; ++i) {
            console.log("this.renderedViews[i]:", this.renderedViews.length);

            if (!this.renderedViews[i]) {
                var nextSection = this.model.getItem(firstSection.uid + i);
                var nextSectionView = this.getSectionView(nextSection);

                this.$el.append(nextSectionView.render().el);

                nextSectionView.bootstrap();
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
        console.log("NavController.scrollTo:", section);

        var offsetTop = 80;
        var $section = $("#" + section.id);
        var duration = (section.index == 0) ? 0.25 : 0.75;

        TweenMax.to(window, duration, {
            scrollTo: { y: $section.offset().top - offsetTop, autoKill: false },
            ease: Power3.easeInOut
        });
    }
}
