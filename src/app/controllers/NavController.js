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
        this.sectionModel = null;
    }

    start() {
        console.log("NavController.start");
        this.$el.empty();
        this.sectionModel = this.model.getCurrentSection();
        this.goto(this.sectionModel);
    }

    next() {
        console.log("NavController.next");
        if (this.model.sectionIndex < this.model.totalSections - 1) {
            this.model.sectionIndex++;
            this.goto(this.model.getCurrentSection());
        }
    }

    previous() {
        console.log("NavController.previous");
        if (this.model.sectionIndex > 0) {
            this.model.sectionIndex--;
            this.goto(this.model.getCurrentSection());
        }
    }

    goto(section) {
        console.log("NavController.goto >>", section.id);

        if (section) {
            this.model.sectionIndex = section.uid;
            if (this.model.sectionIndex > this.model.maxSectionIndex) {
                this.model.maxSectionIndex = this.model.sectionIndex;
            }

            // check if its a different Chapter
            console.log("this.sectionModel", this.sectionModel);
            if (section.chapter.index != this.sectionModel.chapter.index) {
                this.$el.empty();
            }
            this.sectionModel = section;

            this.show();
            this.model.save();
            this.model.trigger('change');
            EventBus.trigger(EventBus.event.NAV_CHANGE, this.model);
        }
    }

    show() {
        console.log("NavController.show");

        var SectionView = Sections[this.sectionModel.id] || BaseView;
        var template = Templates[this.sectionModel.id];

        this.sectionView = new SectionView({
            id: this.sectionModel.id,
            model: this.sectionModel
        });
        this.sectionView.template = template;
        this.sectionView.bootstrap();

        // TODO. Store Views in an Array and remove all before empty()
        this.render();
    }

    render() {
        console.log("NavController.render");

        this.$el.append(this.sectionView.render().el);
        this.sectionView.transitionIn();
        this.scrollTo(this.sectionModel.id);
    }

    scrollTo(id) {
        console.log("NavController.scrollTo:", id);

        var offsetTop = 60;
        var $section = $("#" + id);

        TweenMax.to(window, 1, {
            scrollTo: { y: $section.offset().top - offsetTop, autoKill: false },
            ease: Power3.easeInOut,
            onComplete: this.onScrollComplete,
            onCompleteScope: this
        });
    }

    onScrollComplete() {}

}
