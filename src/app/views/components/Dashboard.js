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
        this.$el.html(this.template(this.model));

        this.progressbar = new Progressbar({
            el: '#progress-bar-menu',
            model: this.model
        });
        this.progressbar.render();
        
        this.validate();

        return this;
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

        this.$("li>a").each((index, el)=> {
            this.$(el).find("a").blur();
            this.$(el).removeClass("disabled").attr("disabled", false);

            if (index > maxSectionUid) {
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
        if (code == 27 && this.isOpen) {
            //ESC press
            this.hide();
            e.preventDefault();
        }
    }
}
