import Backbone from 'backbone';
import Bootstrap from 'bootstrap-sass';
import EventBus from 'helpers/EventBus';
import template from 'templates/navbar.hbs';

export default class NavView extends Backbone.View {

    constructor(options) {
        $.extend(options || {}, {
                el: $("#navigation"),
                events: {
                    'click .navbar-btn': 'navHandler'
                }
            }
        );
        super(options);
    }

    initialize() {
        console.log("CoverPageView.initialize");
        this.template = template;
        this.listenTo(this.model, 'change', this.update);
    }

    render() {
        this.$el.hide();
        this.$el.html(this.template());
        this.$el.fadeIn(250);

        this.update();
        this.$('[data-toggle="tooltip"]').tooltip();

        return this;
    }

    onTransitionInComplete() {
        this.isPageLoading = false;
    }

    update() {
        var isNextEnabled = (this.model.currentSectionIndex !== this.model.totalSections - 1);
        var isPrevEnabled = (this.model.currentSectionIndex !== 0);

        this.enableBtn(this.$("#next"), isNextEnabled);
        this.enableBtn(this.$("#previous"), isPrevEnabled);
    }

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

        $target.tooltip('hide');

        if (isEnabled && !this.isPageLoading) {

            this.enableNav(false);
            this.isPageLoading = true;

            switch (id) {
                case "next":
                    EventBus.trigger(EventBus.event.NAV_NEXT);
                    break;

                case "previous":
                    EventBus.trigger(EventBus.event.NAV_PREVIOUS);
                    break;

                case "sidemenu":
                    this.enableNav(true);
                    this.isPageLoading = false;
                    break;
            }
        }
        e.stopPropagation();
    }
}
