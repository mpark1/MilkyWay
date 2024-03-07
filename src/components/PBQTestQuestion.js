import React, {useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {CheckBox} from '@rneui/themed';
import {scaleFontSize} from '../assets/styles/scaling';

const PBQTestQuestion = ({id, question, setAnswer}) => {
  const [choice, setChoice] = useState(null);

  // Manage point allocation
  const handleChange = value => {
    setChoice(value); // Update the choice with the selected value
    setAnswer(value); // Update the parent component with the chosen points
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.text}>
          {id}
          {'. '}
        </Text>
        <Text style={styles.text}>{question}</Text>
      </View>
      <View style={styles.choices}>
        <View style={styles.choice}>
          <CheckBox
            containerStyle={styles.checkBox}
            size={24}
            checked={choice === 0} // Check if this option is selected
            onPress={() => handleChange(0)}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            uncheckedColor={'#374957'}
            checkedColor={'#6395E1'}
          />
          <Text style={styles.text}>{'  '}매우 그렇지 않다</Text>
        </View>
        <View style={styles.choice}>
          <CheckBox
            containerStyle={styles.checkBox}
            size={24}
            checked={choice === 1}
            onPress={() => handleChange(1)}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            uncheckedColor={'#374957'}
            checkedColor={'#6395E1'}
          />
          <Text style={styles.text}>{'  '}그렇지 않다</Text>
        </View>
        <View style={styles.choice}>
          <CheckBox
            containerStyle={styles.checkBox}
            size={24}
            checked={choice === 2}
            onPress={() => handleChange(2)}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            uncheckedColor={'#374957'}
            checkedColor={'#6395E1'}
          />
          <Text style={styles.text}>{'  '}그렇다</Text>
        </View>
        <View style={styles.choice}>
          <CheckBox
            containerStyle={styles.checkBox}
            size={24}
            checked={choice === 3}
            onPress={() => handleChange(3)}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            uncheckedColor={'#374957'}
            checkedColor={'#6395E1'}
          />
          <Text style={styles.text}>{'  '}매우 그렇다</Text>
        </View>
      </View>
    </View>
  );
};

export default PBQTestQuestion;

const styles = StyleSheet.create({
  container: {
    width: '95%',
    marginBottom: Dimensions.get('window').height * 0.02,
  },
  choices: {
    paddingLeft: Dimensions.get('window').width * 0.04,
    width: '100%',
  },
  choice: {
    flexDirection: 'row',
  },
  text: {
    fontSize: scaleFontSize(18),
    lineHeight: scaleFontSize(24),
    color: '#374957',
    marginBottom: Dimensions.get('window').height * 0.02,
  },
  checkBox: {
    padding: 0,
    marginRight: 0,
    marginLeft: 0,
    marginVertical: 0,
  },
});
