const pool = require('./pool')

addRecord = async (data) => {
    try {
        var conneciton = pool.getPool()
        var status = true
        if (typeof data.tags === 'string') {
            data.tags = JSON.parse(data.tags)
        }
        for (let i = 0; i < data.tags.length; i++) {
            try {
                const query = {
                    text: 'INSERT INTO tagrecord(userID,tagTypeID,wordID) VALUES($1, $2, $3)',
                    values: [data.userID, data.tags[i].tagtypeid, data.tags[i].wordid]
                }
                record = await conneciton.query(query)
            } catch (error) {
                status = false
                console.log(error)
            }
        }
        try {
            await conneciton.query({
                text: 'UPDATE users SET textcount=textcount+1 WHERE userid = $1',
                values: [data.userID]
            })
            await conneciton.query({
                text: 'UPDATE text SET tagcount=tagcount+1 WHERE textid= $1',
                values: [data.textid]
            })
        } catch (error) {
            status = false
            console.log(error)
        }
        return { status: status, message: 'Record successfully added' }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

addTagType = async (data) => {
    try {
        /**
         * TODO Aynı tagname ile 2. bir tag eklenemesin,
         * TODO Aynı renk ile 2. bir tag eklenemesin,
         * TODO null ise ekleme yapılmasın
         */
        var conneciton = pool.getPool()
        const query = {
            text: 'INSERT INTO tagtype(tagname,color) VALUES($1, $2)',
            values: [data.tagname, data.color]
        }
        type = await conneciton.query(query)
        if (type.rowCount != 0) {
            return { status: true, message: 'Type successfully added' }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

getTagTypeID = async (data) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'SELECT * FROM tagtype WHERE tagname = $1',
            values: [data.tagname]
        }
        type = await conneciton.query(query)
        if (type.rowCount != 0) {
            return { status: true, message: 'Type successfully added', id: type.rows[0].tagtypeid }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

getTextTag = async (data) => {
    try {
        var conneciton = pool.getPool()
        console.log(data)
        const query = {
            text:
                'SELECT * FROM( SELECT DISTINCT ON (words.wordid)  words.wordid, words.word, tt.tagtypeid, tt.tagname,words.createdat FROM (SELECT w.wordid, w.word,w.createdat FROM text t, word w WHERE t.textid = $1 AND w.textid = t.textid) words, tagcount tc, tagtype tt WHERE tc.count = (SELECT MAX(count) FROM tagcount WHERE wordid = words.wordid) AND tc.wordid = words.wordid AND tt.tagtypeid = tc.tagtypeid) t ORDER BY t.createdat',
            values: [data.textid]
        }
        tags = await conneciton.query(query)

        const queryT = {
            text: 'SELECT * FROM tagtype'
        }
        types = await conneciton.query(queryT)

        if (types.rowCount != 0 && tags.rowCount != 0) {
            return { status: true, data: { text: tags.rows, types: types.rows } }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

listTagTypes = async (data) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'SELECT * FROM tagtype ORDER BY tagtypeid ASC LIMIT $1 OFFSET $2',
            values: [data.rows, data.offset]
        }
        type = await conneciton.query(query)
        const queryC = {
            text: 'SELECT COUNT(*) FROM tagtype'
        }
        count = await conneciton.query(queryC)
        if (type.rowCount != 0) {
            return { status: true, data: type.rows, count: count.rows[0].count }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}
module.exports = {
    addRecord,
    getTagTypeID,
    addTagType,
    getTextTag,
    listTagTypes
}
