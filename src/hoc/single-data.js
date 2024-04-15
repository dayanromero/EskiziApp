import {compose} from 'src/recompose/compose';
import withState from 'src/recompose/withState';
import lifecycle from 'src/recompose/lifecycle';
import {
  getSingleProduct,
  getSingleBlog,
  getSinglePage,
} from 'src/modules/product/service';

export const getSingleData = lifecycle({
  componentDidMount() {
    console.log('this.props', JSON.stringify(this.props));
    const {route, lang} = this.props;
    const id = route?.params?.id ?? '';
    const type = route?.params?.type ?? 'product';
    console.log('---updateLoading', updateLoading);
    const {updateData, updateLoading} = this.props;
    console.log('---id', id);
    if (id) {
      const fetchData =
        type === 'blog'
          ? getSingleBlog
          : type === 'page'
          ? getSinglePage
          : getSingleProduct;
      fetchData(id, lang)
        .then(data => {
          updateData(data);
        })
        .catch(error => {
          console.log(error, id);
        })
        .finally(() => {
          updateLoading(false);
        });
    } else {
      console.log('por aca')
      updateLoading(false);
    }
  },
});

export const defaultPropsData = compose(
  withState('loading', 'updateLoading', true),
  withState('data', 'updateData', {}),
);
