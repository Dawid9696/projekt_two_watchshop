const { GraphQLServer } = require('graphql-yoga')
const uuidv4 = require('uuid/v4')

//TYPY

var users = [
    {
        id:'1',
        name:'Dawid',
        email:'dawid96.12@tlen.pl',
        age:27
    },{
        id:'2',
        name:'Michal',
        email:'michal96.12@tlen.pl',
        age:23
    },{
        id:'3',
        name:'Ania',
        email:'Anie96.12@tlen.pl',
        age:15
    },{
        id:'4',
        name:'Zbyszek',
        email:'Zbyszek6.12@tlen.pl',
        age:56
    },{
        id:'5',
        name:'Bogdan',
        email:'Bogdan96.12@tlen.pl',
        age:34
    }
]

let posty = [
    {
        id:'10',
        title:'Warzone',
        body:'War in USA, why?',
        published:true,
        author:'1'
    },{
        id:'11',
        title:'My dream',
        body:'I would like to fly',
        published:false,
        author:'2'
    },{
        id:'12',
        title:'Programmer',
        body:'How long I must to learn?',
        published:true,
        author:'4'
    },{
        id:'13',
        title:'Holidays in Turkey',
        body:'The most beautifull places',
        published:true,
        author:'1'
    },{
        id:'14',
        title:'Where are stars?',
        body:'A lot of stars are in space',
        published:false,
        author:'5'
    },{
        id:'15',
        title:'Gardening',
        body:'Which plants are dangerous for us?',
        published:false,
        author:'3'
    },{
        id:'16',
        title:'Chemics',
        body:'Water and CO2',
        published:true,
        author:'3'
    },{
        id:'17',
        title:'Animals',
        body:'Where can we meet lions?',
        published:false,
        author:'5'
    },
]

let comments = [
    {
       id:'1',
       text:'Super sprawa!',
       author:'1',
       post:'11',
    },
    {
        id:'2',
        text:'Polecam!!' ,
        author:'2',
        post:'10',
     },
     {
        id:'3',
        text:'Wydaje sie naprawde fajne!' ,
        author:'4',
        post:'12',
     },
     {
        id:'4',
        text:'Nie jestem zadowolony!' ,
        author:'4',
        post:'13',
     },
     {
        id:'5',
        text:'Nie wiem czy był to dobry zakup!' ,
        author:'2',
        post:'14',
     },
     {
        id:'5',
        text:'Dużo się nauczyłem!' ,
        author:'3',
        post:'15',
     },
     {
        id:'3',
        text:'Zrozumiale i powoli - wybitny tutorial!' ,
        author:'5',
        post:'16',
     },
     {
        id:'2',
        text:'Do kitu!!' ,
        author:'4',
        post:'17',
     },
     {
        id:'2',
        text:'W sumie mam obojętne zdanie!' ,
        author:'2',
        post:'10',
     },
]

const typeDefs = `
    type Query {
        users(queryUser:String!):[User!]!
        posts(queryPost:String!):[Post!]!
        comments:[Comments!]!
        me:User!
        post:Post!
    }

    type Mutation {
        createUser(data:CreateUserInput):User!
        deleteUser(id:ID!):User!
        deletePost(id:ID!):Post!
        createPost(title:String!,body:String!,published:Boolean!,author:ID!):Post!
        createComment(text:String!,author:ID!,post:ID!):Comments!
    },

    input CreateUserInput {
        name:String!
        email:String!
        age:Int
    }

    type User {
        id:ID!
        name:String!
        email:String!
        age:Int!
        posts:[Post!]!
        comments:[Comments!]!
    }

    type Post {
        id:ID!
        title:String!
        body:String!
        published:Boolean!
        author:User!
        comments:[Comments!]!
    }

    type Comments {
        id:ID!
        text:String!
        author:User!
        post:Post!
    }
`

//RESOLVERY

const resolvers = {
    Query: {
        users(parent,args,ctx,info) {
            if(!args.queryUser) {
                return users
            }
            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.queryUser.toLowerCase())
            })
        },
        posts(parent,args,ctx,info) {
            if(!args.queryPost) {
                return posty
            }
            return posty.filter((post) => {
                return post.title.toLowerCase().includes(args.queryPost.toLowerCase())
            })
        },
        comments(parent,args,ctx,info) {
            return comments
        },
        me() {
            return {
                name:"Dawid",
                email:"dawid@tlen.pl"
            }
        },
    },
    Mutation : {
        createUser(parent,args,ctx,info) {
            const emailTaken = users.some((user) => user.email === args.email )
  
            if(emailTaken) {
                throw new Error('Email taken.')
            }
            const user = {
                id:uuidv4(),
                ...args
                // name:args.name,
                // email:args.email,
                // age:args.age
            }
            users.push(user)
            return user
        },
        deleteUser(parent,args,ctx,info) {
            const userIndex = users.findIndex((user) => user.id === args.id)
            console.log(userIndex)
            if(!userIndex === -1) {
                throw new Error('There is no user!')
            }
            const deletedUsers = users.slice(userIndex)
            posts = posty.filter((post) => {
                const match = post.author === args.id
                
                if(match) {
                    comments = comments.filter((comment) => comment.post !== post.id)
                }

                return !match
            })
            comments = comments.filter((comment) => comment.author !== args.id)
            return deletedUsers[0]
        },
        createPost(parents,args,ctx,info) {
            const userExist = users.some((user) => user.id === args.author)
            console.log(userExist)
            if(!userExist) {
                throw new Error('User not found!')
            }
            const post = {
                id:uuidv4(),
                ...args
                // title:args.title,
                // body:args.body,
                // published:args.published,
                // author:args.author
            }
            posty.push(post)
            return post
        },
        deletePost(parent,args,ctx,info) {
            const postIndex = posty.findIndex((post) => post.id === args.id)
            if(postIndex === -1) {
                throw new Error('There is no post')
            }
            const deletedPosts = posty.slice(postIndex)
            return deletedPosts[0]
        },
        createComment(parent,args,ctx,info) {
            const userExist = users.some((user) => user.id === args.author)
            const postExist = posty.some((post) => post.id === args.post && post.published)

            if(!userExist || !postExist) {
                throw new Error('Problem')
            }

            const comment = {
                id:uuidv4(),
                ...args
                // text:args.text,
                // author:args.author,
                // post:args.post
            }

            comments.push(comment)
            return comment
        }
    },
    Post: {
        author(parent,args,ctx,info) {
            return users.find((user) => {
                return user.id == parent.author
            })
        },
        comments(parent,args,ctx,info) {
            return comments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    },
    User: {
        posts(parent,args,ctx,info) {
            return posty.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent,args,ctx,info) {
            return comments.filter((comment) => {
                return comment.id = parent.id
            })
        }
    },
    Comments: {
        author(parent,args,ctx,info) {
            return users.find((user) => {
                return user.author === parent.id
            })
        },
        post(parent,args,ctx,info) {
            return posty.find((post) => {
                return post.id === parent.post
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is working ! ...')
})