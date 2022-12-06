import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import PlacesColumn from './PlacesColumn';
import Heading from 'src/containers/Heading';
import Container from 'src/containers/Container';
import {mainStack} from 'src/config/navigator';
import fetch from 'src/utils/fetchEskizi';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {withNavigation} from '@react-navigation/compat';
import {withTranslation} from 'react-i18next';

import {getSiteConfig, languageSelector} from 'src/modules/common/selectors';

const {width} = Dimensions.get('window');

class Slideshow extends React.Component {
  state = {
    data: [],
    error: null,
  };

  componentDidMount() {
    this.fetchPlaces();
  }

  fetchPlaces = () => {
    const URL = '/eskizi/places/all';
    fetch
      .get(URL)
      .then((data) => {
        this.setState({data});
      })
      .catch((error) => {
        this.setState({error});
      });
  };

  render() {
    const {navigation, t} = this.props;
    const {data} = this.state;

    if (!data || typeof data !== 'object' || Object.keys(data).length < 1) {
      return null;
    }

    return (
      <>
        <Container>
          <Heading
            title={t('common:text_places')}
            style={{}}
            containerStyle={styles.header}
            subTitle={t('common:text_show_all')}
            onPress={() => navigation.navigate(mainStack.places)}
          />
        </Container>
        <PlacesColumn data={data} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 10,
  },
});

Slideshow.defaultProps = {
  widthComponent: width,
};

const mapStateToProps = (state) => ({
  language: languageSelector(state),
  siteConfig: getSiteConfig(state),
});

export default compose(
  connect(mapStateToProps),
  withNavigation,
  withTranslation(),
)(Slideshow);
