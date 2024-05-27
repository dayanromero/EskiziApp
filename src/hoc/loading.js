import branch from 'src/recompose/branch';
import Loading from 'src/components/Loading';
import {renderComponent} from 'src/recompose/renderComponent';

const isLoading = ({loading}) => loading;

export const withLoading = branch(isLoading, renderComponent(Loading));
