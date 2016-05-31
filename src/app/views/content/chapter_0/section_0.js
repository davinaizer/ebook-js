import EventBus from 'helpers/EventBus';
import BaseView from 'views/content/BaseView';

export default class SectionView extends BaseView {

    constructor(options) {
        super(options);
    }

    bootstrap() {
        console.log("SectionView.bootstrap");
        EventBus.trigger(EventBus.event.STATUS_UPDATE, [{"cmi.core.score.raw": 0}]);
        EventBus.trigger(EventBus.event.PAGE_LOADED);
    }
}
