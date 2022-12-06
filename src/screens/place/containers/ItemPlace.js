import React from 'react';
import {useNavigation} from '@react-navigation/native';
import unescape from 'lodash/unescape';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {withTheme, Text} from 'src/components';
import InfoViewer from './InfoViewer';
import Rating from 'src/containers/Rating';
import {mainStack} from 'src/config/navigator';
import {margin, padding, borderRadius} from 'src/components/config/spacing';

import {timeAgo} from 'src/utils/time';

const {width, height} = Dimensions.get('window');

const ItemBlog = ({item, theme, style, tz}) => {
  const navigation = useNavigation();
  if (!item || typeof item !== 'object') {
    return null;
  }
  const imageStyle = {
    width,
    height: 200,
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderColor: theme.colors.border,
        },
        style && style,
      ]}
      onPress={() => navigation.navigate(mainStack.place, {place: item})}>
      <View style={{  }}>
        <Image
          source={
            item.feactured
              ? {uri: item.feactured}
              : require('src/assets/images/pDefault.png')
          }
          resizeMode="cover"
          style={imageStyle}
          containerStyle={styles.viewImage}
        />
        <View style={styles.viewRight}>
          <View style={styles.viewRating}>
            <View>
              <Text h4 medium style={styles.name} numberOfLines={2}>
                {unescape(item.post_title)}
              </Text>
              <Text h6 colorThird style={styles.name}>
                {unescape(item.fields.place_address)}
              </Text>
            </View>
            <Rating
              size={16}
              startingValue={parseFloat(item.fields.place_rating)}
              readonly
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: padding.big,
    borderBottomWidth: 1,
    // height: 200,
  },
  viewImage: {
    borderRadius: borderRadius.base,
    overflow: 'hidden',
  },
  viewRight: {
    marginLeft: margin.large,
    marginTop: margin.small,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 15,
  },
  viewRating: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    marginBottom: margin.small,
  },
  time: {
    marginBottom: margin.big - 4,
  },
});

ItemBlog.defaultProps = {
  width: 137,
  height: 123,
};

export default withTheme(ItemBlog);
