import Backbone from 'backbone';
import EventBus from 'helpers/EventBus';

export default Backbone.View.extend({

    initialize() {
        console.log("NavController.initialize");
    },

    start() {
        this.goto(this.model.getCurrentPage());
    },

    next() {
        if (this.model.currentPageId < this.model.totalPages - 1) {
            this.model.currentPageId++;
            this.goto(this.model.getCurrentPage());
        }
    },

    previous() {
        if (this.model.currentPageId > 0) {
            this.model.currentPageId--;
            this.goto(this.model.getCurrentPage());
        }
    },

    goto(page) {
        if (page) {
            this.model.currentPageId = page.uid;

            if (this.model.currentPageId > this.model.maxPageId) {
                this.model.maxPageId = this.model.currentPageId;
            }

            this.model.save();
            this.model.trigger('change');

            EventBus.trigger(EventBus.event.PAGE_LOAD, page);
            EventBus.trigger(EventBus.event.NAV_CHANGE, this.model);
        }
    }
})
