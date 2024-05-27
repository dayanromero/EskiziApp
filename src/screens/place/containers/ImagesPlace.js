import React from 'react';
import {useTranslation} from 'react-i18next';
import unescape from 'lodash/unescape';
import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Text, Image, ThemedView, withTheme} from 'src/components';
import Carousel from 'react-native-snap-carousel';

import {mainStack} from 'src/config/navigator';

import {margin, padding, borderRadius} from 'src/components/config/spacing';
import {timeAgo} from 'src/utils/time';

const {width} = Dimensions.get('window');
const sliderWidth = width;
const itemWidth = sliderWidth - 90;
const itemHeight = (itemWidth * 284) / 286;
const heightImage = (itemWidth * 284) / 286;

const ImagesPlace = ({navigation, data, theme}) => {
  return (
    <View style={styles.container}>
      <Carousel
        data={data}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        loop
        renderItem={({item}) => (
          <View>
            <Image
              ImageComponent={ImageBackground}
              source={
                item.source
                  ? {uri: item.source}
                  : require('src/assets/images/pDefault.png')
              }
              containerStyle={styles.containerImage}
              style={styles.viewImage}
              imageStyle={styles.image}
            />
          </View>
        )}
        slideStyle={styles.slider}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  slider: {
    width: itemWidth,
  },
  containerImage: {
    borderRadius: borderRadius.base,
    overflow: 'hidden',
    margin: 1,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
    }),
  },
  viewImage: {
    width: itemWidth,
    height: itemHeight,
    justifyContent: 'flex-end',
  },
  image: {
    width: itemWidth,
    height: heightImage,
    resizeMode: 'stretch',
  },
  viewInfo: {
    padding: padding.large,
  },
  textName: {
    marginBottom: margin.small,
  },
  viewLoading: {
    width: itemWidth,
    height: itemHeight,
    borderRadius: borderRadius.large,
  },
});

export default withTheme(ImagesPlace);
