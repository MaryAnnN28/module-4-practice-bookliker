import React from "react";
import {
  Container,
  Header,
  Menu,
  Button,
  List,
  Image
} from "semantic-ui-react";

class App extends React.Component {
  state = {
    books: [], 
    selectedBook: ""
  }

  componentDidMount() {
    fetch("http://localhost:3000/books")
      .then(res => res.json())
      .then(bookData => this.setState({books: bookData}))
  }

  selectBook = (book) => {
    this.setState({selectedBook: book})
  }

  likeBook = (book) => {
    let body = ""
    if (book.users.some(user => user.id === 1)) {
      body = { "users": book.users.filter(user => user.id !== 1) }
    } else {
      body = {
        "users": [...book.users, { "id": 1, "username": "pourous" }]
      }
    }
  
    let reqPack = {}
      reqPack.headers = {"Content-Type": "application/json"}
      reqPack.method = "PATCH"
      reqPack.body = JSON.stringify(body)
    
    fetch(`http://localhost:3000/books/${book.id}`, reqPack)
      .then(res => res.json())
      .then(updatedBook => this.setState({
        books: this.state.books.map(book => book.id === updatedBook.id ? updatedBook : book), selectedBook: updatedBook})
    )
  }
 

  render() {
    return (
      <div>
        <Menu inverted>
          <Menu.Item header>Bookliker</Menu.Item>
        </Menu>
        <main>
          <Menu vertical inverted>
            {this.state.books.map(book => {
              return (
                <Menu.Item as={"a"} onClick={() => this.selectBook(book)}>
                  {book.title}
                </Menu.Item>
              )
            })
            }
          </Menu>
            
          <Container text>
            <Header>{this.state.selectedBook.title}</Header>
            <Image
              src={this.state.selectedBook.img_url}
              size="small"
            />
            <p>{this.state.selectedBook.description}</p>
            {this.state.selectedBook ?
              <Button
                onClick={() => this.likeBook(this.state.selectedBook)}
                color="red"
                content="Like"
                icon="heart"
                label={{
                  basic: true,
                  color: "red",
                  pointing: "left",
                  content: this.state.selectedBook.users.length
                }} /> :
              null
            }
          
              
          
              {this.state.selectedBook ?
              <Header>Liked by</Header> : null}
        
            <List>
              {this.state.selectedBook ? this.state.selectedBook.users.map(user =>
                <List.Item icon="user" content={user.username} />) : null}
            </List>
          </Container>
        </main>
      </div>
    
    );
  }
}


export default App;
