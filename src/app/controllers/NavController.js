import Backbone from 'backbone';
import EventBus from 'helpers/EventBus';

export default class NavController extends Backbone.View {

    constructor(options) {
        super(options);
    }

    initialize() {
        console.log("NavController.initialize");
    }

    start() {
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

}
