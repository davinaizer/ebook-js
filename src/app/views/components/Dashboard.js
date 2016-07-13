import Backbone from 'backbone';
import Bootstrap from 'bootstrap-sass';
import EventBus from 'helpers/EventBus';
import TweenMax from 'gsap';
import Progressbar from 'views/components/Progressbar';
import template from 'templates/components/dashboard.hbs';

export default class DashboardView extends Backbone.View {

    constructor(options) {
        Object.assign(options || {}, {
            events: {
                'click a': 'navHandler'
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
        this.$el.html(this.template(this.model));
        this.clearFixColumns();

        this.progressbar = new Progressbar({
            el: '#progress-bar-menu',
            model: this.model
        });
        this.progressbar.render();

        this.validate();

        return this;
    }

    clearFixColumns() {
        //-- Dynamic CLEAR FIX
        this.$("div.chapter-list").each((i, el) => {
            var count = i + 1;
            if (count % 2 == 0) {
                this.$(el).after('<div class="clearfix visible-sm-block"></div>');
            } else if (count % 3 == 0) {
                this.$(el).after('<div class="clearfix visible-md-block visible-lg-block"></div>');
            }
        });
    }

    show() {
        this.isOpen = true;
        this.render();

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

    validate() {
        var maxSectionUid = this.model.maxSection.uid;
        var currentSectionUid = this.model.currentSection.uid;

        this.$(".list-group > a").each((index, el) => {
            this.$(el).blur();
            this.$(el).removeClass("active disabled").attr("disabled", false);

            if (index == currentSectionUid) {
                this.$(el).addClass("current");
            } else if (index > maxSectionUid) {
                this.$(el).addClass("disabled").attr("disabled", true);
            }
        });
    }

    //-- NAVIGATION FUNTCIONS
    navHandler(e) {
        var $target = this.$(e.currentTarget);
        var id = $target.attr("id");
        var isEnabled = !$target.is("[disabled]") && (id.indexOf("btn-menu-") > -1);

        if (isEnabled && !this.isPageLoading) {
            this.hide();

            var sectionUid = parseInt(id.split("btn-menu-")[1]);
            if (sectionUid >= 0) {
                EventBus.trigger(EventBus.event.NAV_GOTO, this.model.getSection(sectionUid));
            }
        }
        e.preventDefault();
    }

    keyPress(e) {
        var code = e.keyCode || e.which;
        if (code === 27 && this.isOpen) {
            //ESC press
            this.hide();
            e.preventDefault();
        }
    }
}
