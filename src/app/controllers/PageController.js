import $ from 'jquery';
import Backbone from 'backbone';
import EventBus from 'helpers/EventBus';
import TweenMax from 'gsap';
import ScrollToPlugin from "gsap/src/uncompressed/plugins/ScrollToPlugin";


// IMPORT ALL CONTENT CLASSES AND TEMPLATES
import BaseView from 'views/content/BaseView';
import * as Sections from 'views/content/Content';
import * as Templates from 'templates/content/Templates';

export default class PageController extends Backbone.View {

    constructor(options) {
        super(options);
    }

    initialize() {
        console.log("PageController.initialize");

        this.$el = $("#content");
        this.template = null;
        this.currentSection = null;
    }

    fetch(data) {
        console.log("PageController.fetch");

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
        console.log("PageController.scrollTo:");

        var offsetTop = 60;
        var $section = $("#" + section.id);

        TweenMax.to(window, 1, {
            scrollTo: {y: $section.offset().top - offsetTop, autoKill: false},
            ease: Power3.easeInOut,
            onComplete: this.onScrollComplete,
            onCompleteScope: this
        });
    }

    onScrollComplete() {
    }
}
