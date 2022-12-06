import React from 'react';

import ItemPlace from 'src/screens/place/containers/ItemPlace';
import ItemBlogLoading from 'src/screens/blog/containers/ItemBlogLoading';

import {padding} from 'src/components/config/spacing';

const PlacesColumn = ({data, loading, limit, width, height}) => {
  const widthImage = 137;
  const heightImage = (widthImage * 123) / 137;

  return data.map((place, index) => (
    <ItemPlace
      key={index}
      item={place}
      width={widthImage}
      height={heightImage}
      style={index > 0 && {paddingTop: padding.big}}
    />
  ));
};

PlacesColumn.defaultProps = {
  data: [],
  width: 137,
  height: 123,
  loading: true,
  limit: 4,
};

export default PlacesColumn;
