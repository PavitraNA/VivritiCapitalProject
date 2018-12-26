import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';

console.clear();

const Title = ({todoTitle}) => {
  return (
    <div>
       <div>
          <h4>{todoTitle}</h4>
       </div>
    </div>
  );
}

const TodoForm = ({addTodo}) => {
  let input;
  return (
    <form className="list-group-item row">
      <input ref={node => {
        input = node;
      }} />
      <a className="formList" onClick={(e) => {
        e.preventDefault();
        addTodo(input.value);
        input.value = '';
      }}>Save</a> 
      <br />
    </form>
  );
};

const Todo = ({todo, remove, addTocompleteddo}) => {
  return (
    <div className="list-group-item row">
  <a href="#" onClick={(e) => {
        e.preventDefault();
      addTocompleteddo(todo)}
    }>
  {todo.text}
  </a>
    <a className="formList" onClick={() => {remove(todo.id)}}>
      delete
      </a>
  </div>);
}

const CTodo = ({todo}) => {
  return (<a href="#" className="list-group-item">
{todo.text}
</a>);
}

const CompletedTodoList = ({todos}) => {
  const ctodoNode = todos.map((todo) => {
    return (<CTodo 
        todo={todo} 
        key={todo.id} />)
  });
  return (
    <div className="list-group" style={{marginTop:'30px'}}>
    {ctodoNode}
    </div>);
}

const TodoList = ({todos, remove,  addTocompleteddo}) => {
  // Map through the todos
  const todoNode = todos.map((todo) => {
    return (<Todo 
        todo={todo} 
        key={todo.id} 
        remove={remove} 
        addTocompleteddo={addTocompleteddo}/>)
  });
  return (
    <div className="list-group" style={{marginTop:'30px'}}>
    {todoNode}
    </div>);
}

// Contaner Component
// Todo Id
window.id = 0;
class TodoApp extends React.Component{
  constructor(props){
    // Pass props to parent class
    super(props);
    // Set initial state
    this.state = {
      data: [],
      completedData: [],
      addItemTitle: 'ADD ITEM',
      toDo: 'TO DO',
      completed: 'COMPLETED'
    }
    this.apiUrl = 'https://57b1924b46b57d1100a3c3f8.mockapi.io/api/todos'
  }
  // Lifecycle method
  componentDidMount(){
    // Make HTTP reques with Axios
    axios.get(this.apiUrl)
      .then((res) => {
        // Set state with result
        this.setState({data:res.data});
      });
  }
  // Add todo handler
  addTodo(val){
    const todo = {text: val}
    // Update data
    axios.post(this.apiUrl, todo)
       .then((res) => {
          this.state.data.push(res.data);
          this.setState({data: this.state.data});
       });
  }

  addTocompleteddo(val){
    this.handleRemove(val.id);
    const ctodo = {text: val.text}
    axios.post(this.apiUrl, ctodo)
       .then((res) => {
          this.state.completedData.push(res.data);
          this.setState({completedData: this.state.completedData});
       });
  }
  // Handle remove
  handleRemove(id){
    // Filter all todos except the one to be removed
    const remainder = this.state.data.filter((todo) => {
      if(todo.id !== id) return todo;
    });
    // Update state with filter
    axios.delete(this.apiUrl+'/'+id)
      .then((res) => {
        this.setState({data: remainder});
      })
  }


  render(){
    // Render JSX
    return (
      <div>
        <Title todoTitle={this.state.addItemTitle}/>
        <hr />
        <TodoForm addTodo={this.addTodo.bind(this)}/>
        <Title todoTitle={this.state.toDo}/>
        <hr/>
        <TodoList
          todos={this.state.data}
          remove={this.handleRemove.bind(this)}
          addTocompleteddo={this.addTocompleteddo.bind(this)}
        />
        <Title todoTitle={this.state.completed}/>
        <hr/>
        <CompletedTodoList
          todos={this.state.completedData}
        />
      </div>
    );
  }
}
render(<TodoApp />, document.getElementById('container'));