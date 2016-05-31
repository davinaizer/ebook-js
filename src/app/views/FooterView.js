import $ from 'jquery';
import Backbone from 'backbone';
import template from 'templates/footer.hbs';

export default class FooterView extends Backbone.View {

    constructor(options) {
        $.extend(options || {}, {
                el: $("#footer")
            }
        );
        super(options);
    }

    initialize() {
        this.template = template;
        this.listenTo(this.model, 'change', this.update);
    }

    render() {
        this.$el.hide();
        this.$el.html(this.template());
        this.$el.fadeIn(500);

        this.update();

        return this;
    }

    update() {
        var currentP = Math.abs(this.model.currentPageId / (this.model.totalPages - 1) * 100);
        var maxP = Math.abs((this.model.maxPageId - this.model.currentPageId) / (this.model.totalPages - 1) * 100);

        this.$('.progress-bar-max').css('width', maxP + '%');
        this.$('.progress-bar-current').css('width', currentP + '%');
    }
}
