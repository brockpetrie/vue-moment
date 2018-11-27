
import Vue, {PluginFunction} from 'vue';
// @ts-ignore
import moment from 'moment';

declare const VueMoment: VueMoment
export default VueMoment
export interface VueMoment {
  install: PluginFunction<never>
}

declare module 'vue/types/vue' {
  interface Vue {
    readonly $moment: typeof moment;
  }
}
