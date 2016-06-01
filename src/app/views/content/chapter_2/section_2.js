import EventBus from 'helpers/EventBus';
import BaseView from 'views/content/BaseView';

export default class SectionView extends BaseView {

    constructor(options) {
        super(options);
    }

    bootstrap() {
        // FINISH - LESSON_STATUS === COMPLETED
        console.log("EventBus.event.STATUS_FINISH");
        EventBus.trigger(EventBus.event.STATUS_UPDATE, [{"cmi.core.score.raw": 100}]);
        EventBus.trigger(EventBus.event.STATUS_FINISH);
        EventBus.trigger(EventBus.event.PAGE_LOADED);
    }
}
