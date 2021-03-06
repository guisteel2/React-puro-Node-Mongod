import React, { Component } from 'react'
import axios from 'axios'

import PageHeader from '../template/pageHeader'
import TodoForm from '../todo/todoForm'
import TodaList from '../todo/todoList'



const URL = 'http://localhost:3003/api/todos'


export default class Todo extends Component {

    constructor(props){
        super(props)
        this.state = { description: '' , list: [] }

        this.handleChange = this.handleChange.bind(this)
        this.handleAdd    = this.handleAdd.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        
        this.handleMarkAsClear   = this.handleMarkAsClear.bind(this)
        this.handleMarkAsDone    = this.handleMarkAsDone.bind(this)
        this.handleMarkAsPending = this.handleMarkAsPending.bind(this)

        this.refresh()
        
    }

    refresh( description = ''){
        const search = description ? `&description__regex=/${description}/`:''   

        axios.get(`${URL}?sort=createdAt${search}`)
            .then(resp=>this.setState({...this.state, description: '',list: resp.data}))
    }

    handleSearch(){
        this.refresh(this.state.description)
    }


    handleChange(e){
        this.setState({...this.state, description : e.target.value })
    }

    handleAdd(){
        const description = this.state.description
        axios.post(URL, {description}).then(resp=>this.refresh(this.state.description))
    }

    handleRemove(todo){
        axios.delete(`${URL}/${todo._id}`).then(resp => this.refresh())
    }

    handleMarkAsDone(todo){
        axios.put(`${URL}/${todo._id}`, { ...todo, done: true}).then(resp => this.refresh(this.state.description))
    }

    handleMarkAsPending(todo){
        axios.put(`${URL}/${todo._id}`, { ...todo, done: false}).then(resp => this.refresh(this.state.description))
    }

    handleMarkAsClear(){
       this.refresh(this.state.description)
    }



    render(){
        return (
            <div>
               <PageHeader name='Tarefas' small="cadastro" />

               <TodoForm 
                    handleAdd={this.handleAdd}
                    handleChange={this.handleChange}
                    description={this.state.description}
                    handleSearch={this.handleSearch}
                    handleMarkAsClear = {this.handleMarkAsClear}>    
                </TodoForm>

               <TodaList 
                    list={this.state.list}
                    handleRemove={this.handleRemove}
                    handleMarkAsDone={this.handleMarkAsDone}
                    handleMarkAsPending = {this.handleMarkAsPending}>
                </TodaList>

            </div>
        )
    }
}