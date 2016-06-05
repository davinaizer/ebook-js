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
        console.log("NavController.goto(", section.id, ")");

        if (section) {
            //save data
            this.model.save();
            this.model.trigger('change');
            EventBus.trigger(EventBus.event.NAV_CHANGE, this.model);

            // if next Section is in the same Chapter of the currentSection, if not, remove all renderedViews[] and render nextSection
            if (section.chapter.index == this.currentSectionModel.chapter.index) {
                if (this.renderedViews[section.index]) {
                    this.scrollTo(section);
                }
            } else {
                console.log("NavController.goto > New Chapter. Clear all Views.");
                for (var i = 0; i < this.renderedViews.length; ++i) {
                    this.renderedViews[i].undelegateEvents();
                    this.renderedViews[i].remove();
                }
                this.$el.empty();
                this.renderedViews = [];
                $(window).scrollTop(0);
            }

            this.currentSectionModel = section;
            this.render(section);
            this.scrollTo(section);
        }
    }

    /* REDERING VIEWS */
    render(section) {
        console.log("NavController.render");

        var chapter = this.model.getChapter(section.chapter.index);
        var firstSection = chapter.section[0];
        var maxSection = this.model.getMaxItem();
        var sectionsToRender = (maxSection.chapter.index > section.chapter.index) ? section.total : maxSection.index + 1;

        for (var i = 0; i < sectionsToRender; ++i) {
            if (!this.renderedViews[i]) {
                var nextSection = this.model.getItem(firstSection.uid + i);
                var nextSectionView = this.getSectionView(nextSection);

                this.$el.append(nextSectionView.render().el);

                nextSectionView.bootstrap();
                nextSectionView.transitionIn();

                this.renderedViews.push(nextSectionView);

                //-- hide next btn
                if (nextSection.uid < maxSection.uid) {
                    this.renderedViews[i].disableNextSection();
                }
            }
        }
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
            scrollTo: { y: $section.offset().top - offsetTop, autoKill: false },
            ease: Power3.easeInOut
        });
    }
}
