import $ from 'jquery';
import Backbone from 'backbone';
import EventBus from 'helpers/EventBus';
import * as Pages from 'views/pages/Pages';

export default Backbone.View.extend({

    initialize() {
        console.log("PageController.initialize");

        this.$el = $("#page");
        this.model = null;
        this.template = null;
        this.currentPageView = null;
    },

    fetch(page) {
        console.log("PageController.fetch");

        this.model = page;
        this.initModule(Pages[this.model.id]);
    },

    initModule(PageModule) {
        var nextPage = new PageModule({
            id: this.model.id,
            model: this.model,
            className: "background-pages"
        });

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
