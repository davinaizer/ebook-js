import $ from 'jquery';
import Backbone from 'backbone';
import TweenMax from 'gsap';
import EventBus from 'helpers/EventBus';

export default class BaseView extends Backbone.View {

    constructor(options) {
        $.extend(options || {}, {
            events: {
                "click #btn-next-section": "next"
            }
        });
        super(options);
    }

    initialize() {
        console.info("BaseView.initialize(" + this.model.id + ")");
    }

    bootstrap() {
        console.log("BaseView.bootstrap");
        EventBus.trigger(EventBus.event.PAGE_LOADED);
    }

    render() {
        console.log("BaseView.render");

        this.$el.css({opacity: 0});
        this.$el.html(this.template(this.model));

        return this;
    }

    transitionIn() {
        console.log("BaseView.transitionIn");
        TweenMax.to(this.$el, 0.5, {opacity: 1, onComplete: this.transitionInComplete, onCompleteScope: this});
    }

    transitionInComplete() {
        console.log("BaseView.transitionInComplete");
        EventBus.trigger(EventBus.event.PAGE_TRANSITION_IN_COMPLETE);
    }

    disableNextSection() {
        this.$("#btn-next-section").hide();
    }

    next(e) {
        e.preventDefault();
        this.$('#btn-next-section').off();
        TweenMax.to(this.$('#btn-next-section'), 0.25, {autoAlpha: 0});
        EventBus.trigger(EventBus.event.NAV_NEXT);
    }

}
