import React from 'react';

import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {StyleSheet, View, FlatList, ActivityIndicator} from 'react-native';
import {Header, ThemedView} from 'src/components';
import {IconHeader, TextHeader, CartIcon} from 'src/containers/HeaderComponent';
import ItemPlace from './containers/ItemPlace';
import ItemBlogLoading from './containers/ItemBlogLoading';
import filter from 'lodash/filter';

import {getPlaces} from 'src/modules/place/service';
import {getSiteConfig, languageSelector} from 'src/modules/common/selectors';

import {padding, margin} from 'src/components/config/spacing';
import {prepareBlogItem} from 'src/utils/blog';
import {SearchBar} from 'src/components';
class PlaceList extends React.Component {
  state = {
    data: [],
    page: 1,
    loading: true,
    loadingMore: false,
    refreshing: false,
    error: null,
    search: '',
    fullData: [],
  };

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  fetchData = async () => {
    try {
      const {page} = this.state;
      const query = {
        page,
        per_page: 10,
      };
      // eslint-disable-next-line no-undef
      this.abortController = new AbortController();
      const data = await getPlaces(query, {
        signal: this.abortController.signal,
      });

      if (data.length <= 10 && data.length > 0) {
        this.setState((prevState) => ({
          data,
          loading: false,
          fullData: data,
        }));
      } else {
        this.setState({
          loadingMore: false,
          loading: false,
        });
      }
    } catch (error) {
      this.setState({
        error,
        loading: false,
        loadingMore: false,
      });
    }
  };

  handleLoadMore = () => {
    const {loadingMore} = this.state;

    if (loadingMore) {
      this.setState(
        (prevState, nextProps) => ({
          page: prevState.page + 1,
          loadingMore: true,
        }),
        () => {
          this.fetchData();
        },
      );
    }
  };

  renderFooter = () => {
    if (!this.state.loadingMore) {
      return null;
    }

    return (
      <View style={styles.footerFlatlist}>
        <ActivityIndicator animating size="small" />
      </View>
    );
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
      },
      () => {
        this.fetchData();
      },
    );
  };

  handleSearch = (text) => {
    let data = this.state.data;
    data = filter(this.state.fullData, (item) => {
      return this.contains(item, text);
    });
    this.setState({search: text, data});
  };

  contains = (item, query) => {
    const {post_title} = item;
    if (post_title.includes(query)) {
      return true;
    }
    return false;
  };
  render() {
    const {siteConfig, t} = this.props;
    const {data, search, loading} = this.state;

    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          rightComponent={<CartIcon />}
          centerComponent={<TextHeader title={t('common:text_places')} />}
        />
        <SearchBar
          placeholder={t('places:text_placeholder_search')}
          cancelButtonTitle={t('common:text_cancel')}
          onChangeText={(value) => this.handleSearch(value)}
          value={search}
          onChange={this.search}
          autoFocus
          showLoading={loading}
          returnKeyType="search"
          onSubmitEditing={this.searchSubmit}
        />
        <FlatList
          data={data}
          keyExtractor={(item) => `${item.ID}`}
          renderItem={({item, index}) => (
            <ItemPlace tz={siteConfig.get('timezone_string')} item={item} />
          )}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          ListFooterComponent={this.renderFooter()}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
        />
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    paddingTop: padding.big,
    marginHorizontal: margin.large,
    borderTopWidth: 1,
  },
  itemFirst: {
    borderTopWidth: 1,
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  viewLoading: {
    marginVertical: margin.large,
  },
  footerFlatlist: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    language: languageSelector(state),
    siteConfig: getSiteConfig(state),
  };
};

export default connect(mapStateToProps)(withTranslation()(PlaceList));
