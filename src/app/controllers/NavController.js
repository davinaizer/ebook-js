import $ from 'jquery';
import Backbone from 'backbone';
import EventBus from 'helpers/EventBus';
import TweenMax from 'gsap';
import ScrollMagic from 'scrollmagic';
import ScrollToPlugin from "gsap/src/uncompressed/plugins/ScrollToPlugin";

/* COMPONENTS */
import ChapterNav from 'views/components/ChapterNavView'
import SectionNav from 'views/components/SectionNavView';

/* CONTENT AND TEMPLATES */
import BaseView from 'views/content/BaseView';
import * as Sections from 'views/content/Content';
import * as Templates from 'templates/content/Templates';

export default class NavController extends Backbone.View {

    constructor(options) {
        Object.assign(options || {}, {});
        super(options);
    }

    initialize() {
        console.log("NavController.initialize");

        this.scrollControl = new ScrollMagic.Controller({
            globalSceneOptions: {
                triggerHook: "onCenter"
            }
        });
        this.scrollScenes = [];
        this.renderedViews = [];
        this.currentSectionModel = null;
    }

    /* NAV FUNCTIONS */
    start() {
        console.log("NavController.start");

        this.sectionNav = new SectionNav({el: '#section-nav', model: this.model});
        this.sectionNav.render();

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

    gotoChapter(id) {
        var section = this.model.getChapter(id).section[0];
        this.goto(this.model.goto(section));
    }

    goto(section) {
        console.log("NavController.goto(", section.id, ")");

        if (section) {
            this.model.goto(section);

            //save data before rendering page
            this.model.save();
            this.model.trigger('change');
            EventBus.trigger(EventBus.event.NAV_CHANGE, this.model);

            if (section.chapter.index == this.currentSectionModel.chapter.index) {
                if (this.renderedViews[section.index]) {
                    this.scrollTo(section);
                    return;
                }
            } else {
                console.log("NavController.goto > New Chapter. Clear all Views.");

                for (var i = 0; i < this.renderedViews.length; ++i) {
                    this.renderedViews[i].undelegateEvents();
                    this.renderedViews[i].remove();
                    this.scrollScenes[i].destroy();
                }

                //- clear all
                this.sectionNav.render();
                this.chapterNav.remove();
                this.renderedViews = [];
                this.scrollScenes = [];
                this.$el.empty();
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

                // SCROLLMAGIC SCENES
                console.log("SCROLLMAGIC ID:");
                this.scrollScenes[i] = new ScrollMagic.Scene({
                        triggerElement: nextSectionView.el,
                        duration: nextSectionView.$el.height()
                    })
                    .setClassToggle("#item_" + nextSection.id, "active")
                    .addTo(this.scrollControl)

                //-- hide next btn from section already seen
                if (nextSection.uid < maxSection.uid) {
                    this.renderedViews[i].hideNextBtn();
                }
            }
        }

        // show chapterNav if last section
        if (sectionsToRender == section.total) {
            this.chapterNav = new ChapterNav({model: this.model});
            this.$el.append(this.chapterNav.render().el);
        }
    }

    getSectionView(section) {
        var SectionViewClass = Sections[section.id] || BaseView;
        var SectionView = new SectionViewClass({
            id: section.id,
            model: section,
            navModel: this.model
        });
        SectionView.template = Templates[section.id];

        return SectionView;
    }

    scrollTo(section) {
        console.log("NavController.scrollTo:", section.id);

        this.sectionNav.validate();

        var offsetTop = 80;
        var $section = this.$("#" + section.id);
        var duration = (section.index == 0) ? 0.25 : 0.75;

        TweenMax.to(window, duration, {
            scrollTo: {y: $section.offset().top - offsetTop, autoKill: false},
            ease: Power3.easeInOut
        });
    }
}
