import $ from 'jquery';
import Backbone from 'backbone';
import TweenMax from 'gsap';
import Handlebars from 'handlebars';
import EventBus from 'helpers/EventBus';

export default Backbone.View.extend({

    template: null,
    events: {
        "click #btn-next-page": "_next"
    },

    initialize() {
        console.log("----------------- PageView.initialize -----------------");
    },

    bootstrap() {
        var that = this;
        var tplSrc = "templates/" + this.model.src + ".html";

        $.get(tplSrc, function(data) {
                that.template = Handlebars.compile(data);
                EventBus.trigger(EventBus.event.PAGE_LOADED);
            })
            .fail(function() {
                console.error("PageView.load >> ERROR! Page template not found!");
            });
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
