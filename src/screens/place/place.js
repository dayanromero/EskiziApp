import React from 'react';

import {compose} from 'recompose';
import {connect} from 'react-redux';
import merge from 'lodash/merge';
import unescape from 'lodash/unescape';
import {withTranslation} from 'react-i18next';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Share,
  Platform,
  Linking,
  Pressable,
} from 'react-native';
import {Header, Icon, Text, ThemedView, ThemeConsumer} from 'src/components';
import Container from 'src/containers/Container';
import TextHtml from 'src/containers/TextHtml';
import Empty from 'src/containers/Empty';
import InfoViewer from './containers/InfoViewer';
import {IconHeader, TextHeader} from 'src/containers/HeaderComponent';
import Rating from 'src/containers/Rating';
import {defaultPropsData, getSingleData} from 'src/hoc/single-data';
import {withLoading} from 'src/hoc/loading';
import ImagesPlace from './containers/ImagesPlace';
import {timeAgo} from 'src/utils/time';
import {padding, margin, borderRadius} from 'src/components/config/spacing';
import {changeLineHeight, changeColor} from 'src/utils/text-html';
import SlideshowBasic from 'src/screens/home/containers/Slideshow/Basic';
import {mainStack} from 'src/config/navigator';
import {languageSelector} from 'src/modules/common/selectors';
import {Modal} from 'src/components';
import Button from 'src/containers/Button';
import Input from 'src/containers/input/Input';
import {ratePlace} from 'src/modules/place/service';
import {showMessage} from 'react-native-flash-message';
import CommentItem from './containers/CommentItem';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const {width} = Dimensions.get('window');
const WIDTH_IMAGE = width - 2 * padding.large;
const MIN_HEIGHT_IMAGE = (WIDTH_IMAGE * 304) / 344;

const marginSmall = margin.small;
const marginLarge = margin.large;
const marginBig = margin.base + margin.large;

class PlaceDetail extends React.Component {
  constructor(props) {
    super(props);
    const {route, data} = props;
    const place = route?.params?.place ?? null;

    this.state = {
      place: place?.ID ? place : data,
      visible: false,
      rating: 1,
      comment: '',
      loading: false,
    };
  }

  renderData = () => {
    const {navigation, t, siteConfig} = this.props;
    const {place} = this.state;
    console.log('place', JSON.stringify(place.fields.place_phone));
    if (!place || !place.ID) {
      return (
        <Empty
          title={'Get data fail'}
          subTitle={'Check place id'}
          titleButton="Go Places"
          clickButton={() => navigation.navigate(mainStack.places)}
        />
      );
    }
    const imageData = {
      auto_play: true,
      auto_play_delay: 300,
      auto_play_interval: 5000,
      boxed: false,
      height: 250,
      indicator: true,
      width: 375,
      images: [
        {
          id: 1,
          image: {
            en: place.fields.image_gallery[0]?.image,
            ar: place.fields.image_gallery[0]?.image,
          },
        },
        {
          id: 2,
          image: {
            en: place.fields.image_gallery[1]?.image,
            ar: place.fields.image_gallery[1]?.image,
          },
        },
        {
          id: 3,
          image: {
            en: place.fields.image_gallery[2]?.image,
            ar: place.fields.image_gallery[2]?.image,
          },
        },
      ],
    };

    return (
      <ThemeConsumer>
        {({theme}) => (
          <ScrollView>
            <SlideshowBasic
              fields={imageData}
              widthComponent={width}
              clickGoPage={() => true}
            />
            <Container>
              <View style={styles.textDesc}>
                <View style={styles.descContainer}>
                  <Text h2 medium style={styles.textTitle}>
                    {unescape(place.post_title)}
                  </Text>
                  <Text h4 colorThird>
                    {unescape(place.fields.place_address)}
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text h4 colorThird>
                      {unescape(place.fields.place_phone)}
                    </Text>
                    <Icon
                      name={'phone'}
                      type="font-awesome"
                      color={theme.colors.primary}
                      size={20}
                      onPress={() =>
                        Linking.openURL(`tel:${place.fields.place_phone}`)
                      }
                      containerStyle={{paddingHorizontal: 15}}
                    />
                    <Icon
                      name={'whatsapp'}
                      type="font-awesome"
                      color={theme.colors.primary}
                      size={20}
                      onPress={() =>
                        Linking.openURL(
                          `whatsapp://send?text=hello&phone=${place.fields.place_phone}`,
                        )
                      }
                    />
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => this.setState({visible: true})}>
                  <Rating
                    size={16}
                    startingValue={parseFloat(place.fields.place_rating)}
                    readonly
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.viewDesciption}>
                <TextHtml
                  value={place.fields.place_description}
                  style={merge(
                    changeColor(theme.Text.secondary.color),
                    changeLineHeight(28),
                  )}
                />
              </View>
              <Text h3 medium style={styles.title}>
                {t('places:comments')}
              </Text>
              {place.fields.author_comments.map((review) => (
                <CommentItem key={review.author_id} data={review} />
              ))}
            </Container>
          </ScrollView>
        )}
      </ThemeConsumer>
    );
  };

  clickRate = () => {
    this.setState(
      {
        loading: true,
      },
      this.onRate,
    );
  };

  onRate = async () => {
    try {
      const {rating, place} = this.state;
      await ratePlace(place.ID, rating);
      this.setState({
        loading: false,
        visible: false,
      });
      showMessage({
        message: 'Rate success',
        type: 'success',
        duration: 3000,
      });
    } catch (e) {
      this.setState({
        loading: false,
        visible: false,
      });
    }
  };

  render() {
    const {t} = this.props;
    const {visible, rating, comment, loading} = this.state;
    return (
      <ThemedView isFullView>
        <Header leftComponent={<IconHeader />} />
        {this.renderData()}
        <Modal
          visible={visible}
          setModalVisible={() => this.setState({visible: false})}
          topRightElement={
            <Button
              onPress={this.clickRate}
              title={t('common:text_rate')}
              size={'small'}
              buttonStyle={styles.button}
              loading={loading}
            />
          }>
          <Text h2 medium style={styles.rateTitle}>
            {t('places:text_rate_this')}
          </Text>
          <View style={styles.ratingContiner}>
            <Rating
              size={50}
              startingValue={rating}
              onStartRating={(value) => this.setState({rating: value})}
            />
          </View>
          <Container>
            <Input
              label={t('places:text_write_comment')}
              value={comment}
              onChangeText={(value) => this.setState({comment: value})}
              multiline
              numberOfLines={8}
            />
          </Container>
        </Modal>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: WIDTH_IMAGE,
    minHeight: MIN_HEIGHT_IMAGE,
    borderRadius: borderRadius.large,
  },
  textTime: {
    marginBottom: marginSmall,
  },
  viewDesciption: {
    marginVertical: margin.base,
  },
  textDesc: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateTitle: {
    textAlign: 'center',
  },
  ratingContiner: {
    marginTop: 15,
    alignItems: 'center',
  },
  descContainer: {
    width: width / 1.5,
  },
  title: {
    marginBottom: margin.small + 1,
    paddingHorizontal: padding.large,
  },
});

const mapStateToProps = (state) => {
  return {
    lang: languageSelector(state),
  };
};

const withReduce = connect(mapStateToProps);

export default compose(
  withTranslation(),
  withReduce,
  defaultPropsData,
  getSingleData,
  withLoading,
)(PlaceDetail);
