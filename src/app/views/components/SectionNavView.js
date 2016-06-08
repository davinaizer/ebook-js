/**
 * Created by Naizer on 02/06/2016.
 */
import $ from 'jquery';
import Backbone from 'backbone';
import template from 'templates/components/section_nav';

export default class SectionsNavView extends Backbone.View {

    constructor(options) {
        Object.assign(options || {}, {
                el: $("#section-guide")
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
