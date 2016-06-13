import Backbone from 'backbone';
import Bootstrap from 'bootstrap-sass';
import EventBus from 'helpers/EventBus';
import Dashboard from 'views/components/Dashboard'
import template from 'templates/components/navbar.hbs';

export default class NavbarView extends Backbone.View {

    constructor(options) {
        Object.assign(options || {}, {
            events: {
                'click .navbar-btn': 'navHandler'
            }
        });
        super(options);
    }

    initialize() {
        console.log("NavView.initialize");
        this.template = template;
        this.dashboard = new Dashboard({ el: '#dashboard', model: this.model });

        this.listenTo(this.model, 'change', this.update);
    }

    render() {
        console.log("NavView.render");
        this.$el.hide();
        this.$el.html(this.template());
        this.$el.fadeIn(250);

        this.$el.append(this.dashboard.render().el);

        this.update();
        this.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });

        return this;
    }

    onTransitionInComplete() {
        this.isPageLoading = false;
    }

    update() {}

    enableBtn($btn, isEnabled) {
        if (isEnabled) {
            $btn.removeAttr("disabled");
            $btn.css("cursor", "");
            $btn.fadeTo(250, 1);
        } else {
            $btn.attr("disabled", "disabled");
            $btn.css("cursor", "default");
            $btn.fadeTo(250, 0.1);
        }
    }

    enableNav(isEnabled) {
        var $navbarBtn = this.$(".navbar-btn");

        if (isEnabled) {
            $navbarBtn.removeAttr("disabled");
            $navbarBtn.css("cursor", "");
        } else {
            $navbarBtn.attr("disabled", "disabled");
            $navbarBtn.css("cursor", "default");
        }
    }

    //-- NAVIGATION FUNTCIONS
    navHandler(e) {
        var $target = this.$(e.currentTarget);
        var id = $target.attr("id");
        var isEnabled = !$target.is("[disabled]");

        if (isEnabled && !this.isPageLoading) {

            // this.enableNav(false);
            // this.isPageLoading = true;

            switch (id) {
            case "next":
                EventBus.trigger(EventBus.event.NAV_NEXT);
                break;

            case "previous":
                EventBus.trigger(EventBus.event.NAV_PREVIOUS);
                break;

            case "menu":
                console.log("OPEN MENU");
                this.dashboard.toggle();
                break;
            }
        }
        e.stopPropagation();
    }
}
