/**
 * Created by Naizer on 02/06/2016.
 */
import $ from 'jquery';
import Backbone from 'backbone';
import template from 'templates/';

export default class ChaptersGuideView extends Backbone.View {

    constructor(options) {
        $.extend(options || {}, {
                el: $("#chapter-guide")
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
