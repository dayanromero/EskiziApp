import {createElement} from 'react';
import setDisplayName from './setDisplayName';
import wrapDisplayName from './wrapDisplayName';

const identity = Component => Component;

const branch =
  (test, left, right = identity) =>
  BaseComponent => {
    let leftFactory;
    let rightFactory;
    const Branch = props => {
      if (test(props)) {
        leftFactory = leftFactory || left(BaseComponent);
        return createElement(leftFactory, props);
      }
      rightFactory = rightFactory || right(BaseComponent);
      return createElement(rightFactory, props);
    };

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'branch'))(Branch);
    }
    return Branch;
  };

export default branch;
