import $ from 'jquery';
import Backbone from 'backbone';
import EventBus from 'helpers/EventBus';

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
        this.model = null;
        this.template = null;
        this.currentSection = null;
    }

    fetch(data) {
        console.log("PageController.fetch");

        this.model = data;

        var Section = Sections[this.model.id];
        var template = Templates[this.model.id];

        if (!Section) {
            Section = BaseView;
        }

        var nextSection = new Section({
            id: this.model.id,
            model: this.model,
            className: "background-pages"
        });

        nextSection.template = template;

        if (this.currentSection) {
            // this.currentSection.remove();
        }

        this.currentSection = nextSection;
        this.currentSection.bootstrap();
    }

    render() {
        //-- check for vertical/append page or empty page first
        this.$el.append(this.currentSection.render().el);
        this.currentSection.transitionIn();
        //scrollTo(currentSection);
    }
}
