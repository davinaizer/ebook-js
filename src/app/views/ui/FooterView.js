import $ from 'jquery';
import Backbone from 'backbone';
import template from 'templates/ui/footer.hbs';

export default Backbone.View.extend({

    el: $("#footer"),
    template: template,

    initialize() {
        this.listenTo(this.model, 'change', this._update);
    },

    render() {
        this.$el.hide();
        this.$el.html(this.template());
        this.$el.fadeIn(500);

        this._update();

        return this;
    },

    _update() {
        var currentP = Math.abs(this.model.currentPageId / (this.model.totalPages - 1) * 100);
        var maxP = Math.abs((this.model.maxPageId - this.model.currentPageId) / (this.model.totalPages - 1) * 100);

        this.$('.progress-bar-max').css('width', maxP + '%');
        this.$('.progress-bar-current').css('width', currentP + '%');
    }
})
