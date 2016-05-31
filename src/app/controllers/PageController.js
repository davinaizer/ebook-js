import $ from 'jquery';
import Backbone from 'backbone';
import EventBus from 'helpers/EventBus';

// IMPORT ALL SECTIONS
import * as Sections from 'views/pages/chapters';
import * as Templates from 'views/pages/templates';
import PageView from 'views/pages/PageView';

export default Backbone.View.extend({

    initialize() {
        console.log("PageController.initialize");

        this.$el = $("#page");
        this.model = null;
        this.template = null;
        this.currentPageView = null;
    },

    fetch(page) {
        console.log("PageController.fetch", page);

        this.model = page;
        var section = Sections[this.model.id];
        var template = Templates[this.model.id];

        this.initModule(section, template);
    },

    initModule(PageModule, template) {
        var nextPage = new PageModule({
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
    },

    render() {
        //-- check for vertical/append page or empty page first
        this.$el.append(this.currentPageView.render().el);
        this.currentPageView.transitionIn();
    }
})
