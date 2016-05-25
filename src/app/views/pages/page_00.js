import $ from 'jquery';
import Backbone from 'backbone';
import TweenMax from 'gsap';
import EventBus from 'helpers/EventBus';
import template from 'templates/pages/page_00.hbs';

export default Backbone.View.extend({

    template: template,
    events: {
        "click #btn-next-page": "_next"
    },

    initialize() {
        console.log("----------------- PageView.initialize -----------------");
    },

    bootstrap() {
        EventBus.trigger(EventBus.event.PAGE_LOADED);
    },

    render() {
        console.log("PageView.render");

        this.$el.css({ opacity: 0 });
        this.$el.html(this.template(this.model));

        return this;
    },

    transitionIn() {
        console.log("PageView.transitionIn");
        TweenMax.to(this.$el, 0.5, { opacity: 1, onComplete: $.proxy(this.transitionInComplete, this) });
    },

    transitionInComplete() {
        console.log("PageView.transitionInComplete");
        EventBus.trigger(EventBus.event.PAGE_TRANSITION_IN_COMPLETE);
    },

    _next() {
        EventBus.trigger(EventBus.event.NAV_NEXT);
    }
})
