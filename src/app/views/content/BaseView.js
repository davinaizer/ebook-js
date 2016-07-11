import Backbone from 'backbone';
import TweenMax from 'gsap';
import EventBus from 'helpers/EventBus';

export default class BaseView extends Backbone.View {

    constructor(options) {
        Object.assign(options || {}, {
            events: {
                "click #btn-next-section": "next"
            }
        });
        super(options);
    }

    initialize() {
        //console.info("BaseView.initialize(" + this.model.id + ")");
        this.isVisited = false;
    }

    bootstrap() {
        EventBus.trigger(EventBus.event.PAGE_LOADED);
    }

    render() {
        this.$el.css({opacity: 0});
        this.$el.html(this.template(this.model));

        return this;
    }

    transitionIn() {
        TweenMax.to(this.$el, 0.5, {opacity: 1, onComplete: this.transitionInComplete, onCompleteScope: this});
    }

    transitionInComplete() {
        EventBus.trigger(EventBus.event.PAGE_TRANSITION_IN_COMPLETE);
    }

    hideNextBtn() {
        TweenMax.set(this.$('#btn-next-section'), {autoAlpha: 0});
    }

    next(e) {
        if (!this.isVisited) {
            this.hideNextBtn();
            this.isVisited = true;
            EventBus.trigger(EventBus.event.NAV_NEXT);
        }
        e.preventDefault();
    }
}
