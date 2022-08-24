import React, {Component} from "react";
import Pagination from "@material-ui/lab/Pagination"
import AuthService from "../../../auth/auth.service";
import UsersService from "../../../services/users.service";
import {Button} from "@material-ui/core";
import {AddBox, Delete, Edit} from "@material-ui/icons";

export default class ManageUsers extends Component {
    constructor(props) {
        super(props);

        this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
        this.retrieveUsers = this.retrieveUsers.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.setActiveUser = this.setActiveUser.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handlePageSizeChange = this.handlePageSizeChange.bind(this);

        this.state = {
            users: [],
            selectedUser: null,
            currentIndex: -1,
            page: 1,
            count: 0,
            pageSize: 3,
            currentUser: undefined,
            searchUser: "",
            message: ""
        };
        this.pageSizes = [3, 6, 9];

    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser.roles.includes("ROLE_ADMIN")) this.setState({redirect: "/login"});
        this.setState({currentUser: currentUser});

        this.retrieveUsers();
    }


    // tek user
    onChangeSearchTitle(e) {
        const searchUser = e.target.value;
        this.setState({
            searchUser: searchUser,
        });
    }

    retrieveUsers() {
        const {searchUser, page, pageSize} = this.state;
        UsersService.getUserByNameWithPagination(searchUser, page - 1, pageSize)
            .then((response) => {
                    const {users, totalPages} = response.data;
                    this.setState({
                        users: users,
                        count: totalPages
                    });
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        message: resMessage
                    });
                }
            ).catch((e) => {
            console.log(e);
        })
    }

    refreshList() {
        this.retrieveUsers();
        this.setState({
            selectedUser: null,
            currentIndex: -1
        })
    }

    setActiveUser(user, index) {
        localStorage.setItem("selectedUser", JSON.stringify(user));
        this.setState({
            selectedUser: user,
            currentIndex: index
        });
    }

    handlePageChange(event, value) {
        this.setState({
                page: value
            }, () => {
                this.retrieveUsers();
            }
        )
    }

    handlePageSizeChange(event) {
        this.setState({
            pageSize: event.target.value,
            page: 1
        }, () => {
            this.retrieveUsers();
        })
    }

    deleteUser(userId) {
        UsersService.removeUser(userId)
            .then(this.refreshList);
    }


    render() {
        const {
            searchUser,
            users,
            selectedUser,
            currentIndex,
            page,
            count,
            pageSize,
            message
        } = this.state;

        return (

            message ? (
                <div className="col-md-8">
                    <div className="alert alert-danger" role="alert">
                        {this.state.message}
                    </div>
                </div>
            ) : (
                <div className="list row">

                    <div className="col-md-8">
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search users by name"
                                value={searchUser}
                                onChange={this.onChangeSearchTitle}
                            />
                            <div className="input-group-append">
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={this.retrieveUsers}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <h4>User List</h4>

                        <div className="mt-3">
                            {"Items per Page: "}
                            <select onChange={this.handlePageSizeChange} value={pageSize}>
                                {this.pageSizes.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>

                            <Pagination
                                className="my-3"
                                count={count}
                                page={page}
                                siblingCount={1}
                                boundaryCount={1}
                                variant="outlined"
                                shape="rounded"
                                onChange={this.handlePageChange}
                            />
                        </div>

                        <ul className="list-group">
                            {users &&
                                users.map((user, index) => (
                                    <li
                                        className={
                                            "list-group-item " +
                                            (index === currentIndex ? "active" : "")
                                        }
                                        onClick={() => {
                                            this.setActiveUser(user, index)
                                        }}
                                        key={index}
                                    >
                                        {user.username}
                                    </li>
                                ))}
                        </ul>

                    </div>

                    <div className="col-md-6">
                        {selectedUser ? (
                            <div className="bottom-margin">
                                <h4>User</h4>
                                <div>
                                    <label>
                                        <strong>User name:</strong>
                                    </label>{" "}
                                    {selectedUser.username}
                                </div>
                                <div>
                                    <label>
                                        <strong>Read Books Number:</strong>
                                    </label>{" "}
                                    {selectedUser.readBooksNumber}
                                </div>


                                <div>
                                    <label>
                                        <strong>User id:</strong>
                                    </label>{" "}
                                    {selectedUser.id}
                                </div>


                                <div>
                                    <label>
                                        <strong>Create Date:</strong>
                                    </label>{" "}
                                    {selectedUser.createDate}
                                </div>


                                <div>
                                    <label>
                                        <strong>Authorities:</strong>
                                    </label>
                                    {" "}
                                    <ul>
                                        {selectedUser.roles &&
                                            Array.from(selectedUser.roles).map((role, index) => <li key={index}>{role.name}</li>)}
                                    </ul>

                                </div>

                                <div>
                                    <label>
                                        <strong>Is active:</strong>
                                    </label>{" "}
                                    {selectedUser.active ? "Active" : "Not active"}
                                </div>

                                <br/>

                            </div>
                        ) : (
                            <div>
                                <br/>
                                <p>Please click on a user...</p>
                            </div>
                        )}

                        <div >
                            {selectedUser && (
                                <Button variant="contained" startIcon={<Edit/>} href='/editUser'>
                                    Edit User
                                </Button>
                            )}
                            &emsp;
                            {selectedUser && (
                                <Button variant="contained" className="deleteButton" startIcon={<Delete/>}
                                        onClick={() => {
                                            this.deleteUser(selectedUser.id);
                                        }}>
                                    Delete User
                                </Button>
                            )}
                            &emsp;
                            {selectedUser && (
                                <Button variant="contained" startIcon={<AddBox/>} href="/createUser">
                                    Add User
                                </Button>
                            )}
                        </div>



                    </div>

                </div>
            )

        )


    }

}