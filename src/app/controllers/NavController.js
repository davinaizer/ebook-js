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
        this.currentSection = null;
    }

    start() {
        this.$el.empty();
        this.goto(this.model.getCurrentSection());
    }

    next() {
        if (this.model.sectionIndex < this.model.totalSections - 1) {
            this.model.sectionIndex++;
            this.goto(this.model.getCurrentSection());
        }
    }

    previous() {
        if (this.model.sectionIndex > 0) {
            this.model.sectionIndex--;
            this.goto(this.model.getCurrentSection());
        }
    }

    goto(section) {
        if (section) {
            this.model.sectionIndex = section.uid;

            if (this.model.sectionIndex > this.model.maxSectionIndex) {
                this.model.maxSectionIndex = this.model.sectionIndex;
            }

            this.model.save();
            this.model.trigger('change');

            EventBus.trigger(EventBus.event.PAGE_LOAD, section);
            EventBus.trigger(EventBus.event.NAV_CHANGE, this.model);
        }
    }

    show(data) {
        console.log("NavController.show");

        var Section = Sections[data.id];
        var template = Templates[data.id];

        if (!Section) {
            Section = BaseView;
        }

        var nextSection = new Section({
            id: data.id,
            model: data
        });

        this.currentSection = nextSection;
        this.currentSection.template = template;
        this.currentSection.bootstrap();
    }

    render() {
        this.$el.append(this.currentSection.render().el);
        this.currentSection.transitionIn();
        this.scrollTo(this.currentSection);
    }

    scrollTo(section) {
        console.log("NavController.scrollTo:");

        var offsetTop = 60;
        var $section = $("#" + section.id);

        TweenMax.to(window, 1, {
            scrollTo: { y: $section.offset().top - offsetTop, autoKill: false },
            ease: Power3.easeInOut,
            onComplete: this.onScrollComplete,
            onCompleteScope: this
        });
    }

    onScrollComplete() {}

}
