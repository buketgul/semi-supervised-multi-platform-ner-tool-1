import React, { useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import moment from 'moment'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { makeStyles } from '@material-ui/styles'
import {
    Card,
    CardActions,
    CardContent,
    Avatar,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    TablePagination
} from '@material-ui/core'

import { getInitials } from 'helpers'

const useStyles = makeStyles(theme => ({
    root: {},
    content: {
        padding: 0
    },
    inner: {
        minWidth: 1050
    },
    nameContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    avatar: {
        marginRight: theme.spacing(2)
    },
    actions: {
        justifyContent: 'flex-end'
    }
}))

const UsersTable = props => {
    const { className, users, ...rest } = props

    const classes = useStyles()

    const [selectedUsers, setSelectedUsers] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [page, setPage] = useState(0)
    console.log(users)

    const handlePageChange = (event, page) => {
        setPage(page)
    }

    const handleRowsPerPageChange = event => {
        setRowsPerPage(event.target.value)
    }

    return (
        <Card {...rest} className={clsx(classes.root, className)}>
            <CardContent className={classes.content}>
                <PerfectScrollbar>
                    <div className={classes.inner}>
                        {users > 1 ? (
                            /*
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        
                                        <TableCell>Name</TableCell>
                                        <TableCell>Surname</TableCell>
                                        <TableCell>Username</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Tagged Text</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.slice(0, rowsPerPage).map(user => (
                                        <TableRow
                                            className={classes.tableRow}
                                            hover
                                            key={user.id}
                                            selected={selectedUsers.indexOf(user.id) !== -1}
                                        >
                                            <TableCell>
                                                <div className={classes.nameContainer}>
                                                    <Typography variant="body1">{user.name}</Typography>
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.surname}</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.textCount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>*/
                            <div>İlk</div>
                        ) : (
                            <div>Hello World</div>
                        )}
                    </div>
                </PerfectScrollbar>
            </CardContent>
            <CardActions className={classes.actions}>
                <TablePagination
                    component="div"
                    //count={users.length}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </CardActions>
        </Card>
    )
}

UsersTable.propTypes = {
    className: PropTypes.string,
    users: PropTypes.array.isRequired
}

export default UsersTable
