import { get, noop } from 'lodash';
import { unset } from '../../utils';

export function unused(oldKey) {
  return (settings, log = noop) => {
    const value = get(settings, oldKey);
    if (value === undefined) {
      return;
    }

    unset(settings, oldKey);
    log(`${oldKey} is deprecated and is no longer used`);
  };
}
