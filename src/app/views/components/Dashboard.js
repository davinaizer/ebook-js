import Backbone from 'backbone';
import Bootstrap from 'bootstrap-sass';
import EventBus from 'helpers/EventBus';
import TweenMax from 'gsap';
import template from 'templates/components/dashboard.hbs';

export default class DashboardView extends Backbone.View {

    constructor(options) {
        Object.assign(options || {}, {
            events: {
                'click .navbar-btn': 'navHandler'
            }
        });
        super(options);
    }

    initialize() {
        this.isOpen = false;
        this.template = template;
    }

    render() {
        console.log("DashboardView.render");
        this.$el.html(this.template());

        return this;
    }

    show() {
        this.isOpen = true;
        this.$(".dashboard").height("100%");
        $("body").css("overflow", "hidden");
    }

    hide() {
        this.isOpen = false;
        this.$(".dashboard").height(0);
        $("body").css("overflow", "scroll");
    }

    toggle() {
        if (this.isOpen) {
            this.hide();
        } else {
            this.show();
        }
    }

    //-- NAVIGATION FUNTCIONS
    navHandler(e) {
        var $target = this.$(e.currentTarget);
        var id = $target.attr("id");
        var isEnabled = !$target.is("[disabled]");

        if (isEnabled && !this.isPageLoading) {}
        e.stopPropagation();
    }
}
