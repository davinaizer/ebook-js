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
        this.currentPageView = null;
    }

    fetch(page) {
        console.log("PageController.fetch");

        this.model = page;

        var Section = Sections[this.model.id];
        var template = Templates[this.model.id];

        if (!Section) {
            Section = BaseView;
        }

        var nextPage = new Section({
            id: this.model.id,
            model: this.model,
            className: "background-pages"
        });

        nextPage.template = template;

        if (this.currentPageView) {
            // this.currentPageView.remove();
        }

        this.currentPageView = nextPage;
        this.currentPageView.bootstrap();
    }

    render() {
        //-- check for vertical/append page or empty page first
        this.$el.append(this.currentPageView.render().el);
        this.currentPageView.transitionIn();
    }
}

