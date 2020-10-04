import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import SegmentedControl from '@react-native-community/segmented-control';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Constants from 'expo-constants';
import moment from 'moment';

import { TodoDetailHeaderLeft, TodoDetailHeaderRight } from './TodoDetailHeader';
import { TodoDetailScreenProps, TodoDetailScreenState } from '../../types';
import { Todo } from '../../models/Todo';

export class TodoDetailScreen extends React.Component<TodoDetailScreenProps, TodoDetailScreenState> {

  state: TodoDetailScreenState = {
    datePickerVisible: false,
    datePickerDateMode: true,
    todoID: '',
    todoTitle: '',
    todoPriority: 0,
    todoDone: false,
    todoDate: new Date(),
  };

  componentDidMount() {
    const todo = (this.props.route.params.todo || new Todo('', ''));
    this.setState({
      todoID: todo.id,
      todoTitle: todo.title,
      todoPriority: todo.priority,
      todoDone: todo.done,
      todoDate: todo.date
    });

    this.props.navigation.setOptions({
      headerTitle: '',
      headerLeft: () => <TodoDetailHeaderLeft onPress={() => this.props.navigation.goBack()} />,
      headerRight: () => <TodoDetailHeaderRight onPress={this.onSavePressed.bind(this)} />,
      headerStatusBarHeight: 0,
      headerStyle: styles.headerStyle
    });
  }

  datePickerUpdated(date: Date) {
    this.setState({ datePickerVisible: false, todoDate: date });
  }

  onSavePressed() {
    const todo = new Todo(this.state.todoID, this.state.todoTitle, this.state.todoDone,
      this.state.todoPriority, this.state.todoDate);

    this.props.route.params.onSave(todo);
    this.props.navigation.goBack();
  }

  onDeletePressed() {
    const todo = new Todo(this.state.todoID, this.state.todoTitle, this.state.todoDone,
      this.state.todoPriority, this.state.todoDate);

    this.props.route.params.onDelete(todo);
    this.props.navigation.goBack();
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.mainView}>
          <View style={styles.subView}>
            <TextInput
              style={styles.todoTitleInput}
              onChangeText={text => this.setState({ todoTitle: text })}
              value={this.state.todoTitle}
              placeholder="Remind Me To..."
            />
          </View>

          <View style={[styles.subView, styles.subViewCenter, { padding: 20, }]}>
            <SegmentedControl
              values={['None', 'Low', 'Medium', 'High']}
              selectedIndex={this.state.todoPriority}
              style={styles.segmentedControl}
              onChange={(event) => {
                this.setState({ todoPriority: event.nativeEvent.selectedSegmentIndex });
              }}
            />
          </View>

          <View
            style={[styles.subView, styles.subViewCenter]}
          >
            <TouchableOpacity
              style={[styles.touchableOpacity, { flex: 1 }]}
              onPress={() => this.setState({ datePickerVisible: true, datePickerDateMode: true })}
            >
              <Text style={styles.text}>{moment(this.state.todoDate).format('ddd MMM D, yyyy')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.touchableOpacity}
              onPress={() => this.setState({ datePickerVisible: true, datePickerDateMode: false })}
            >
              <Text style={styles.text}>{moment(this.state.todoDate).format('hh:mm A')}</Text>
            </TouchableOpacity>
          </View>

          <DateTimePickerModal
            date={this.state.todoDate}
            isVisible={this.state.datePickerVisible}
            headerTextIOS={`Pick a ${this.state.datePickerDateMode ? "date" : "time"}`}
            mode={(this.state.datePickerDateMode ? "date" : "time")}
            onConfirm={this.datePickerUpdated.bind(this)}
            onCancel={() => this.setState({ datePickerVisible: false })}
          />

          <View style={{ flex: 1 }} />

          { !this.props.route.params.isNew &&
            <View>
              <TouchableOpacity
                onPress={this.onDeletePressed.bind(this)}
                style={styles.touchableOpacityCenter}
              >
                <Text style={styles.delete}>Delete Todo</Text>
              </TouchableOpacity>
            </View>
          }
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  headerStyle: {
    height: 60,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderColor: Constants.manifest.extra.defaultColor.systemGray4
  },
  mainView: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: "white"
  },
  subView: {
    borderBottomColor: Constants.manifest.extra.defaultColor.systemGray4,
    borderBottomWidth: 1,
    padding: 5,
  },
  subViewCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  todoTitleInput: {
    fontSize: 20,
    padding: 15,
    borderColor: Constants.manifest.extra.defaultColor.systemGray5
  },
  segmentedControl: {
    height: 40,
    flex: 1
  },
  text: {
    fontSize: 17
  },
  touchableOpacity: {
    padding: 15,
  },
  touchableOpacityCenter: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  delete: {
    color: Constants.manifest.extra.defaultColor.systemRed,
    fontSize: 17,
    textTransform: "capitalize",
  }
});