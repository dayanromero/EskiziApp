import React from 'react';

import ItemPlace from 'src/screens/place/containers/ItemPlace';

import {padding} from 'src/components/config/spacing';

const PlacesColumn = ({data}) => {
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
};

export default PlacesColumn;
