import React from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {StyleSheet, View, ActivityIndicator, FlatList} from 'react-native';
import {Header, ThemedView} from 'src/components';
import Empty from 'src/containers/Empty';
import {IconHeader, CartIcon, TextHeader} from 'src/containers/HeaderComponent';
import OrderItem from './order/OrderItem';

import fetch from 'src/utils/fetchEskizi';
import {authSelector} from 'src/modules/auth/selectors';
import {languageSelector} from 'src/modules/common/selectors';

import {homeTabs} from 'src/config/navigator';

import {margin} from 'src/components/config/spacing';

class ListOrder extends React.Component {
  state = {
    data: [],
    page: 1,
    loading: true,
    loadingMore: false,
    refreshing: false,
    error: null,
  };

  componentDidMount() {
    this.fetchOrders();
  }

  componentWillUnmount() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  fetchOrders = () => {
    const {
      auth: {user},
      language,
    } = this.props;
    const {page} = this.state;
    const URL = `/wc/v3/orders?page=${page}&per_page=10&customer=${user.ID}&lang=${language}`;
    // const URL = `/wc/v3/orders?page=${page}&per_page=10`;
    this.abortController = new AbortController();
    fetch
      .get(URL, {
        signal: this.abortController.signal,
      })
      .then((data) => {
        if (data.length <= 10 && data.length > 0) {
          this.setState((prevState) => ({
            data: page === 1 ? Array.from(data) : [...prevState.data, ...data],
            loading: false,
            loadingMore: data.length === 10,
            refreshing: false,
          }));
        } else {
          this.setState({
            loadingMore: false,
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({error, loading: false, loadingMore: false});
      });
  };
  _handleLoadMore = () => {
    const {loadingMore} = this.state;

    if (loadingMore) {
      this.setState(
        (prevState) => ({
          page: prevState.page + 1,
          loadingMore: true,
        }),
        () => {
          this.fetchOrders();
        },
      );
    }
  };

  renderFooter = () => {
    if (!this.state.loadingMore) {
      return null;
    }

    return (
      <View style={styles.viewLoadingFooter}>
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
        this.fetchOrders();
      },
    );
  };
  renderData = () => {
    const {data, loading, refreshing} = this.state;
    const {navigation, t} = this.props;

    if (loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      );
    }
    if (data.length > 0) {
      return (
        <FlatList
          data={data}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({item, index}) => (
            <OrderItem data={item} visit={index} style={styles.item} />
          )}
          onEndReached={this._handleLoadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          ListFooterComponent={this.renderFooter}
          refreshing={refreshing}
          onRefresh={this.handleRefresh}
        />
      );
    }
    return (
      <Empty
        icon="box"
        title={t('empty:text_title_order')}
        subTitle={t('empty:text_subtitle_order')}
        clickButton={() => navigation.navigate(homeTabs.shop)}
      />
    );
  };

  render() {
    const {t} = this.props;
    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={t('common:text_orders')} />}
          rightComponent={<CartIcon />}
        />
        {this.renderData()}
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    marginBottom: margin.base,
  },
  viewLoadingFooter: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
  },
  loading: {
    marginVertical: margin.large,
  },
});
const mapStateToProps = (state) => {
  return {
    auth: authSelector(state),
    language: languageSelector(state),
  };
};
export default connect(mapStateToProps)(withTranslation()(ListOrder));
