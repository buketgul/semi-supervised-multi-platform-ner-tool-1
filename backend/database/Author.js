const pool = require('./pool')

list = async (data) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'SELECT * FROM author WHERE authorid != 1 ORDER BY authorid ASC LIMIT $1 OFFSET $2',
            values: [data.rows, data.offset]
        }
        authors = await conneciton.query(query)
        const queryC = {
            text: 'SELECT COUNT(*) FROM author'
        }
        count = await conneciton.query(queryC)
        return { status: true, data: authors.rows, count: count.rows[0].count }
    } catch (error) {
        return { status: false, data: [] }
    }
}

get = async () => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'SELECT * FROM author WHERE crawl = true'
        }
        authors = await conneciton.query(query)
        return { status: true, data: authors.rows }
    } catch (error) {
        return { status: false, data: [] }
    }
}

add = async (data) => {
    try {
        var conneciton = pool.getPool()
        const check = {
            text: 'SELECT * FROM author WHERE mainurl=$1',
            values: [data.mainurl]
        }
        chk = await conneciton.query(check)
        if (chk.rows.length === 0) {
            const query = {
                text: 'INSERT INTO author(authorname,mainurl,category) VALUES($1,$2,$3) RETURNING authorid',
                values: [data.authorname, data.mainurl, data.category]
            }
            added = await conneciton.query(query)
            if (added.rowCount != 0) {
                return { status: true, message: 'Author successfully added', id: added.rows[0].authorid }
            } else {
                return { status: false, message: 'Query error, please try again' }
            }
        } else {
            return { status: false, message: 'Author is already exist' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

block = async (authorid) => {
    try {
        var conneciton = pool.getPool()
        const blockQ = {
            text: 'UPDATE author SET crawl = false WHERE authorid= $1',
            values: [authorid]
        }
        block = await conneciton.query(blockQ)
        if (block.rowCount != 0) {
            return { status: true, message: 'Author successfully blocked' }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

unblock = async (authorid) => {
    try {
        var conneciton = pool.getPool()
        const blockQ = {
            text: 'UPDATE author SET crawl = true WHERE authorid= $1',
            values: [authorid]
        }
        block = await conneciton.query(blockQ)
        if (block.rowCount != 0) {
            return { status: true, message: 'Author successfully unblocked' }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

module.exports = {
    list,
    add,
    get,
    block,
    unblock
}
