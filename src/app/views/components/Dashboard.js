import Backbone from 'backbone';
import Bootstrap from 'bootstrap-sass';
import EventBus from 'helpers/EventBus';
import TweenMax from 'gsap';
import template from 'templates/components/dashboard.hbs';

export default class DashboardView extends Backbone.View {

    constructor(options) {
        Object.assign(options || {}, {
            events: {
                'click .btn': 'navHandler'
            }
        });

        super(options);
    }

    initialize() {
        this.bind("navHandler", 'keyPress');

        this.isOpen = false;
        this.template = template;

        //-- lister for keyboard
        $(document).on('keydown', (e) => {
            this.keyPress(e);
        });
    }

    render() {
        console.log("DashboardView.render");
        this.$el.html(this.template());

        return this;
    }

    show() {
        this.isOpen = true;
        this.$(".dashboard").height("100%");
        this.$(".dashboard").scrollTop(0);

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
        console.log(e);
        var $target = this.$(e.currentTarget);
        var id = $target.attr("id");
        var isEnabled = !$target.is("[disabled]");

        if (isEnabled && !this.isPageLoading) {
            switch (id) {
                case "menu-close":
                    this.hide();
                    break;
            }
        }
        e.preventDefault();
    }

    keyPress(e) {
        var code = e.keyCode || e.which;
        if (code == 27 && this.isOpen) {
            //ESC press
            this.hide();
            e.preventDefault();
        }
    }
}
