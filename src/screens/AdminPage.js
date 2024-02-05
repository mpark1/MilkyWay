import globalStyle from '../assets/styles/globalStyle';
import {Text} from 'react-native';
import {SafeAreaView} from 'react-native';

const AdminPage = ({navigation}) => {
  return (
    <SafeAreaView style={globalStyle.flex}>
      <Text>관리자 페이지입니다.</Text>
    </SafeAreaView>
  );
};

export default AdminPage;
