import $ from 'jquery';
import Backbone from 'backbone';
import template from 'templates/components/section_nav.hbs';

export default class SectionsNavView extends Backbone.View {

    constructor(options) {
        Object.assign(options || {}, {
                el: "#section-nav"
            }
        );
        super(options);
    }

    initialize() {
        this.template = template;
    }

    render() {
        this.$el.hide();
        this.$el.html(this.template());
        this.$el.fadeIn(500);

        return this;
    }
}
