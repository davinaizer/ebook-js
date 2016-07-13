import Backbone from 'backbone';
import Bootstrap from 'bootstrap-sass';
import EventBus from 'helpers/EventBus';
import template from 'templates/components/section_nav.hbs';

export default class SectionsNavView extends Backbone.View {

    constructor(options) {
        Object.assign(options || {}, {
                el: "#section-nav",
                events: {
                    "click li": "sectionNav"
                }
            }
        );
        super(options);
    }

    initialize() {
        this.template = template;
    }

    render() {
        console.log("SectionsNavView.render:");

        this.$el.hide();
        this.$el.html(this.template(this.model));
        this.$el.fadeIn(500);

        this.$('[data-toggle="tooltip"]').tooltip({trigger: 'hover'});
        this.validate();

        return this;
    }

    validate() {
        var currentSection = this.model.currentSection;
        var maxSection = this.model.maxSection;
        var maxSectionIndex = (maxSection.chapter.index > currentSection.chapter.index) ? currentSection.total : maxSection.index;

        this.$("li").each((index, el)=> {
            this.$(el).find("a").blur();
            this.$(el).removeClass("disabled").attr("disabled", false);

            if (index > maxSectionIndex) {
                this.$(el).addClass("disabled").attr("disabled", true);
            }
        });
    }

    sectionNav(e) {
        var $target = this.$(e.currentTarget);
        var sectionUid = $target.attr("id").split("section-nav-item-")[1];
        var isEnabled = !$target.is("[disabled]");

        if (isEnabled) {
            var section = this.model.getSection(sectionUid);
            EventBus.trigger(EventBus.event.NAV_GOTO, section);
        }
        e.preventDefault();
    }
}
