
import Vue, {PluginFunction} from 'vue';
import moment from 'moment';

export interface VueMoment {
  install: PluginFunction<any>;
}
declare const VueMoment: VueMoment;
export default VueMoment;

declare module 'vue/types/vue' {
  interface Vue {
    readonly $moment: typeof moment;
  }
}
