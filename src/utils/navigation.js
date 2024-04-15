import {useNavigation} from '@react-navigation/native';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params = {}) {
  const navigation = useNavigation();
  _navigator.dispatch(
    navigation.navigate({
      routeName,
      params,
    }),
  );
}

function goBack() {
  const navigation = useNavigation();
  _navigator.dispatch(navigation.goBack());
}

// add other navigation functions that you need and export them

export default {
  navigate,
  goBack,
  setTopLevelNavigator,
};
