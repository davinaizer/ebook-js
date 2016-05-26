import Backbone from 'backbone';
import Bootstrap from 'bootstrap-sass';
import EventBus from 'helpers/EventBus';
import template from 'templates/ui/navbar.hbs';

export default Backbone.View.extend({

    el: $("#navigation"),
    template: template,
    events: {
        'click .navbar-btn': 'navHandler'
    },

    initialize: function() {
        this.listenTo(this.model, 'change', this.update);
    },

    render: function() {
        this.$el.hide();
        this.$el.html(this.template());
        this.$el.fadeIn(250);

        this.update();
        this.$('[data-toggle="tooltip"]').tooltip();

        return this;
    },

    onTransitionInComplete: function() {
        this.isPageLoading = false;
    },

    update: function() {
        var isNextEnabled = (this.model.currentPageId !== this.model.totalPages - 1);
        var isPrevEnabled = (this.model.currentPageId !== 0);

        this.enableBtn(this.$("#next"), isNextEnabled);
        this.enableBtn(this.$("#previous"), isPrevEnabled);
    },

    enableBtn: function($btn, isEnabled) {
        if (isEnabled) {
            $btn.removeAttr("disabled");
            $btn.css("cursor", "");
            $btn.fadeTo(250, 1);
        } else {
            $btn.attr("disabled", "disabled");
            $btn.css("cursor", "default");
            $btn.fadeTo(250, 0.1);
        }
    },

    enableNav: function(isEnabled) {
        var $navbarBtn = this.$(".navbar-btn");

        if (isEnabled) {
            $navbarBtn.removeAttr("disabled");
            $navbarBtn.css("cursor", "");
        } else {
            $navbarBtn.attr("disabled", "disabled");
            $navbarBtn.css("cursor", "default");
        }
    },

    //-- NAVIGATION FUNTCIONS
    navHandler: function(e) {
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
})
